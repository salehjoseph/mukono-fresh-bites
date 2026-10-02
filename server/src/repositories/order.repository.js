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

export async function findAllOrders({ status, limit = 50 }) {
  const conditions = [];
  const params = { limit };

  if (status) {
    conditions.push('status = :status');
    params.status = status;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT id, order_number, customer_name, customer_phone, order_type, status,
            payment_status, total_ugx, created_at
     FROM orders
     ${where}
     ORDER BY created_at DESC
     LIMIT :limit`,
    params,
  );
  return rows;
}

export async function findOrderById(id) {
  const [orderRows] = await pool.query(`SELECT * FROM orders WHERE id = :id`, { id });
  const order = orderRows[0];
  if (!order) return null;

  const [items] = await pool.query(
    `SELECT item_name, unit_price_ugx, quantity, line_total_ugx, notes
     FROM order_items WHERE order_id = :id`,
    { id },
  );

  return { ...order, items };
}

export async function updateOrderStatus(id, fromStatus, toStatus) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // The WHERE clause checks the CURRENT status too — if two staff members click
    // "confirm" on the same order at the same instant, only the first succeeds;
    // the second gets 0 affected rows and a clear error, instead of silently
    // double-applying a transition or corrupting the state.
    const [result] = await connection.query(
      `UPDATE orders SET status = :toStatus WHERE id = :id AND status = :fromStatus`,
      { id, toStatus, fromStatus },
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false; // order didn't exist, or was already changed by someone else
    }

    await connection.query(
      `INSERT INTO order_status_history (order_id, from_status, to_status)
       VALUES (:id, :fromStatus, :toStatus)`,
      { id, fromStatus, toStatus },
    );

    await connection.commit();
    return true;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
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