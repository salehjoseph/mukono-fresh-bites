exports.up = function (db) {
  return db.createTable('menu_items', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    category_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'menu_items_category_id_fk',
        table: 'categories',
        rules: { onDelete: 'RESTRICT', onUpdate: 'CASCADE' },
        mapping: 'id',
      },
    },
    name: { type: 'string', length: 150, notNull: true },
    slug: { type: 'string', length: 170, notNull: true, unique: true },
    description: { type: 'text' },
    price_ugx: { type: 'int', notNull: true },
    image_url: { type: 'string', length: 500 },
    image_alt: { type: 'string', length: 200 },
    is_available: { type: 'boolean', notNull: true, defaultValue: true },
    is_featured: { type: 'boolean', notNull: true, defaultValue: false },
    is_active: { type: 'boolean', notNull: true, defaultValue: true },
    sort_order: { type: 'int', notNull: true, defaultValue: 0 },
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('menu_items');
};