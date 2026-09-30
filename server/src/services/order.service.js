import { pool } from '../config/db.js';
import * as orderRepo from '../repositories/order.repository.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

export async function createOrder(input) {
  const existing = await orderRepo.findOrderByIdempotencyKey(input.idempotencyKey);
  if (existing) {
    // Same request seen before (double-click, retry): return the same order, don't create a new one.
    return { orderNumber: existing.order_number, alreadyExisted: true };
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Look up real, current prices and availability. Never trust the client for this.
    const requestedIds = input.items.map((i) => i.menuItemId);
    const dbItems = await orderRepo.findMenuItemsByIds(connection, requestedIds);

    const priced = input.items.map((line) => {
      const dbItem = dbItems.find((d) => d.id === line.menuItemId);
      if (!dbItem || !dbItem.is_active) {
        const err = new Error('One of the selected items is no longer on the menu.');
        err.status = 400;
        err.code = 'ITEM_NOT_FOUND';
        throw err;
      }
      if (!dbItem.is_available) {
        const err = new Error(`${dbItem.name} is currently unavailable.`);
        err.status = 400;
        err.code = 'ITEM_UNAVAILABLE';
        throw err;
      }
      return {
        menuItemId: dbItem.id,
        itemName: dbItem.name,
        unitPriceUgx: dbItem.price_ugx,
        quantity: line.quantity,
        lineTotalUgx: dbItem.price_ugx * line.quantity,
      };
    });

    const subtotalUgx = priced.reduce((sum, line) => sum + line.lineTotalUgx, 0);

    const MIN_ORDER_UGX = 5000; // TODO: move to business_settings once admin settings exist
    if (subtotalUgx < MIN_ORDER_UGX) {
      const err = new Error(`Minimum order is ${MIN_ORDER_UGX} UGX.`);
      err.status = 400;
      err.code = 'BELOW_MINIMUM';
      throw err;
    }

    let deliveryFeeUgx = 0;
    if (input.orderType === 'DELIVERY') {
      const zone = await orderRepo.findDeliveryZoneById(connection, input.deliveryZoneId);
      if (!zone) {
        const err = new Error('Selected delivery zone is not available.');
        err.status = 400;
        err.code = 'INVALID_ZONE';
        throw err;
      }
      deliveryFeeUgx = zone.fee_ugx;
    }

    const totalUgx = subtotalUgx + deliveryFeeUgx;
    const orderNumber = generateOrderNumber();

    const orderId = await orderRepo.insertOrder(connection, {
      orderNumber,
      idempotencyKey: input.idempotencyKey,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail || null,
      orderType: input.orderType,
      deliveryZoneId: input.orderType === 'DELIVERY' ? input.deliveryZoneId : null,
      deliveryAddress: input.deliveryAddress || null,
      subtotalUgx,
      deliveryFeeUgx,
      totalUgx,
      paymentMethod: 'CASH',
      customerNotes: input.customerNotes || null,
    });

    await orderRepo.insertOrderItems(connection, orderId, priced);
    await orderRepo.insertStatusHistory(connection, orderId, 'PENDING');

    await connection.commit();

    return { orderNumber, subtotalUgx, deliveryFeeUgx, totalUgx, alreadyExisted: false };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}