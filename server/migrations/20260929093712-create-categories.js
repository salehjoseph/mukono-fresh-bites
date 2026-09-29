exports.up = function (db) {
  return db.createTable('categories', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: { type: 'string', length: 100, notNull: true },
    slug: { type: 'string', length: 120, notNull: true, unique: true },
    sort_order: { type: 'int', notNull: true, defaultValue: 0 },
    is_active: { type: 'boolean', notNull: true, defaultValue: true },
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('categories');
};