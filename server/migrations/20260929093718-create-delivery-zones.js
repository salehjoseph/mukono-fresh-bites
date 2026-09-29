exports.up = function (db) {
  return db.createTable('delivery_zones', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: { type: 'string', length: 100, notNull: true },
    description: { type: 'text' },
    fee_ugx: { type: 'int', notNull: true },
    estimated_minutes: { type: 'int' },
    is_active: { type: 'boolean', notNull: true, defaultValue: true },
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('delivery_zones');
};