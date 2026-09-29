exports.up = function (db) {
  return db.createTable('sessions', {
    id: { type: 'string', length: 128, primaryKey: true },
    user_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'sessions_user_id_fk',
        table: 'users',
        rules: { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
        mapping: 'id',
      },
    },
    expires_at: { type: 'timestamp', notNull: true },
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('sessions');
};