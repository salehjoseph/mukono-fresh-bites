exports.up = function (db) {
  return db.createTable('audit_logs', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: { type: 'int' },
    action: { type: 'string', length: 100, notNull: true },
    entity_type: { type: 'string', length: 50 },
    entity_id: { type: 'int' },
    details: { type: 'text' },
    ip_address: { type: 'string', length: 45 },
    created_at: { type: 'timestamp', notNull: true, defaultValue: new String('CURRENT_TIMESTAMP') },
  });
};

exports.down = function (db) {
  return db.dropTable('audit_logs');
};