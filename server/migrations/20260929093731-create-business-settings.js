exports.up = function (db) {
  return db.createTable('business_settings', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    business_name: { type: 'string', length: 150, notNull: true },
    phone: { type: 'string', length: 20 },
    whatsapp: { type: 'string', length: 20 },
    address: { type: 'string', length: 255 },
    opening_hours: { type: 'string', length: 255 },
    min_order_ugx: { type: 'int', notNull: true, defaultValue: 0 },
    updated_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('business_settings');
};