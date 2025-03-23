const { db } = require('../config/database');

class TrustedDevice {
  static findByUserId(userId, callback) {
    db.all('SELECT * FROM trusted_devices WHERE user_id = ?', [userId], callback);
  }

  static upsert({ user_id, device_id, user_agent, is_trusted }, callback) {
    db.get(
      'SELECT * FROM trusted_devices WHERE user_id = ? AND device_id = ?',
      [user_id, device_id],
      (err, row) => {
        if (err) return callback(err);
        if (row) {
          db.run(
            'UPDATE trusted_devices SET user_agent = ?, is_trusted = ? WHERE user_id = ? AND device_id = ?',
            [user_agent, Number(is_trusted), user_id, device_id],
            callback
          );
        } else {
          db.run(
            'INSERT INTO trusted_devices (user_id, device_id, user_agent, is_trusted) VALUES (?, ?, ?, ?)',
            [user_id, device_id, user_agent, Number(is_trusted)],
            callback
          );
        }
      }
    );
  }

  static delete(userId, deviceId, callback) {
    db.run(
      'DELETE FROM trusted_devices WHERE user_id = ? AND device_id = ?',
      [userId, deviceId],
      function (err) {
        callback(err, this.changes);
      }
    );
  }
}

module.exports = TrustedDevice;