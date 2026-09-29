exports.up = function (db) {
  return db.createTable('order_status_history', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    order_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'order_status_history_order_id_fk',
        table: 'orders',
        rules: { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
        mapping: 'id',
      },
    },
    from_status: { type: 'string', length: 25 },
    to_status: { type: 'string', length: 25, notNull: true },
    changed_by_user_id: { type: 'int' },
    note: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('order_status_history');
};