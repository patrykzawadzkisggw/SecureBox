const { db } = require('../config/database');

class Password {
  static findByUserId(userId, callback) {
    db.all('SELECT * FROM passwords WHERE user_id = ?', [userId], callback);
  }

  static create({ passwordfile, logo, platform, login, user_id }, callback) {
    const id = crypto.randomUUID();
    db.run(
      'INSERT INTO passwords (id, passwordfile, logo, platform, login, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, passwordfile, logo, platform, login, user_id],
      callback
    );
    return id;
  }

  static findByUserPlatformLogin(userId, platform, login, callback) {
    db.get(
      'SELECT * FROM passwords WHERE user_id = ? AND platform = ? AND login = ?',
      [userId, platform, login],
      callback
    );
  }

  static update(id, passwordfile, callback) {
    db.run('UPDATE passwords SET passwordfile = ? WHERE id = ?', [passwordfile, id], callback);
  }

  static delete(userId, platform, login, callback) {
    db.run(
      'DELETE FROM passwords WHERE user_id = ? AND platform = ? AND login = ?',
      [userId, platform, login],
      callback
    );
  }

  static updateAll(userId, passwords, callback) {
    db.all('SELECT * FROM passwords WHERE user_id = ?', [userId], callback);
  }
}

module.exports = Password;