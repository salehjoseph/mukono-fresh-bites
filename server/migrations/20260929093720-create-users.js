exports.up = function (db) {
  return db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: { type: 'string', length: 100, notNull: true },
    email: { type: 'string', length: 150, notNull: true, unique: true },
    password_hash: { type: 'string', length: 255, notNull: true },
    role: { type: 'string', length: 20, notNull: true, defaultValue: 'STAFF' },
    is_active: { type: 'boolean', notNull: true, defaultValue: true },
    failed_login_attempts: { type: 'int', notNull: true, defaultValue: 0 },
    locked_until: { type: 'timestamp' },
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('users');
};