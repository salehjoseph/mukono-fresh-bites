import { pool } from '../config/db.js';

export async function findMenuItemsByIds(connection, ids) {
  if (ids.length === 0) return [];
  const [rows] = await connection.query(
    `SELECT id, name, price_ugx, is_available, is_active
     FROM menu_items
     WHERE id IN (:ids)`,
    { ids },
  );
  return rows;
}

export async function findDeliveryZoneById(connection, id) {
  const [rows] = await connection.query(
    `SELECT id, name, fee_ugx FROM delivery_zones WHERE id = :id AND is_active = TRUE`,
    { id },
  );
  return rows[0] || null;
}

export async function findOrderByIdempotencyKey(key) {
  const [rows] = await pool.query(
    `SELECT order_number FROM orders WHERE idempotency_key = :key`,
    { key },
  );
  return rows[0] || null;
}

export async function insertOrder(connection, order) {
  const [result] = await connection.query(
    `INSERT INTO orders
      (order_number, idempotency_key, customer_name, customer_phone, customer_email,
       order_type, delivery_zone_id, delivery_address, subtotal_ugx, delivery_fee_ugx,
       total_ugx, status, payment_method, payment_status, customer_notes)
     VALUES
      (:orderNumber, :idempotencyKey, :customerName, :customerPhone, :customerEmail,
       :orderType, :deliveryZoneId, :deliveryAddress, :subtotalUgx, :deliveryFeeUgx,
       :totalUgx, 'PENDING', :paymentMethod, 'UNPAID', :customerNotes)`,
    order,
  );
  return result.insertId;
}

export async function insertOrderItems(connection, orderId, items) {
  for (const item of items) {
    await connection.query(
      `INSERT INTO order_items
        (order_id, menu_item_id, item_name, unit_price_ugx, quantity, line_total_ugx)
       VALUES (:orderId, :menuItemId, :itemName, :unitPriceUgx, :quantity, :lineTotalUgx)`,
      { orderId, ...item },
    );
  }
}

export async function insertStatusHistory(connection, orderId, toStatus) {
  await connection.query(
    `INSERT INTO order_status_history (order_id, from_status, to_status)
     VALUES (:orderId, NULL, :toStatus)`,
    { orderId, toStatus },
  );
}