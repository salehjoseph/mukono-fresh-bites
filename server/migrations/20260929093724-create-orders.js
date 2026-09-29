exports.up = function (db) {
  return db.createTable('orders', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    order_number: { type: 'string', length: 20, notNull: true, unique: true },
    idempotency_key: { type: 'string', length: 100, notNull: true, unique: true },
    customer_name: { type: 'string', length: 100, notNull: true },
    customer_phone: { type: 'string', length: 20, notNull: true },
    customer_email: { type: 'string', length: 150 },
    order_type: { type: 'string', length: 20, notNull: true },
    delivery_zone_id: {
      type: 'int',
      foreignKey: {
        name: 'orders_delivery_zone_id_fk',
        table: 'delivery_zones',
        rules: { onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
        mapping: 'id',
      },
    },
    delivery_address: { type: 'text' },
    subtotal_ugx: { type: 'int', notNull: true },
    delivery_fee_ugx: { type: 'int', notNull: true, defaultValue: 0 },
    total_ugx: { type: 'int', notNull: true },
    status: { type: 'string', length: 25, notNull: true, defaultValue: 'PENDING' },
    payment_method: { type: 'string', length: 20, notNull: true, defaultValue: 'CASH' },
    payment_status: { type: 'string', length: 20, notNull: true, defaultValue: 'UNPAID' },
    customer_notes: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('orders');
};