exports.up = function (db) {
  return db.createTable('order_items', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    order_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'order_items_order_id_fk',
        table: 'orders',
        rules: { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
        mapping: 'id',
      },
    },
    menu_item_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'order_items_menu_item_id_fk',
        table: 'menu_items',
        rules: { onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
        mapping: 'id',
      },
    },
    item_name: { type: 'string', length: 150, notNull: true },
    unit_price_ugx: { type: 'int', notNull: true },
    quantity: { type: 'int', notNull: true },
    line_total_ugx: { type: 'int', notNull: true },
    notes: { type: 'text' },
  });
};

exports.down = function (db) {
  return db.dropTable('order_items');
};