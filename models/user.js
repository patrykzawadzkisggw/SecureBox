const { db } = require('../config/database');
const crypto = require('crypto');

class User {
  static create({ first_name, last_name, login, password }, callback) {
    const id = crypto.randomUUID();
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    db.run(
      'INSERT INTO users (id, first_name, last_name, login, password) VALUES (?, ?, ?, ?, ?)',
      [id, first_name, last_name, login, hashedPassword],
      callback
    );
    return id;
  }

  static findByLoginAndPassword(login, password, callback) {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    db.get(
      'SELECT * FROM users WHERE login = ? AND password = ?',
      [login, hashedPassword],
      callback
    );
  }

  static findById(id, callback) {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  }

  static update(id, { first_name, last_name, login, password }, callback) {
    const updates = {};
    if (first_name) updates.first_name = first_name;
    if (last_name) updates.last_name = last_name;
    if (login) updates.login = login;
    if (password) updates.password = crypto.createHash('sha256').update(password).digest('hex');

    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    db.run(`UPDATE users SET ${fields} WHERE id = ?`, values, callback);
  }
}

module.exports = User;