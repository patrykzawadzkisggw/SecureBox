const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const db = new sqlite3.Database('password_manager.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database');
});

const initDB = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        login TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS passwords (
        id TEXT PRIMARY KEY,
        passwordfile TEXT NOT NULL,
        logo TEXT NOT NULL,
        platform TEXT NOT NULL,
        login TEXT NOT NULL,
        user_id TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS trusted_devices (
        user_id TEXT NOT NULL,
        device_id TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        is_trusted INTEGER NOT NULL,
        PRIMARY KEY (user_id, device_id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS login_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        user_id TEXT NOT NULL,
        login TEXT NOT NULL,
        page TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  });
};

const populateInitialData = async () => {
  db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
    if (err) return console.error(err.message);
    if (row.count === 0) {
      const userId = '1';
      const hashedPassword = crypto.createHash('sha256').update('password123').digest('hex');
      db.run(
        'INSERT INTO users (id, first_name, last_name, login, password) VALUES (?, ?, ?, ?, ?)',
        [userId, 'Jan', 'Kowalski', 'szaleniec', hashedPassword]
      );

      const passwordId = crypto.randomUUID();
      db.run(
        'INSERT INTO passwords (id, passwordfile, logo, platform, login, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          passwordId,
          'p1.txt',
          'https://static.vecteezy.com/system/resources/previews/013/948/544/non_2x/gmail-logo-on-transparent-white-background-free-vector.jpg',
          'Google',
          'example@gmail.com',
          userId,
        ]
      );

      const deviceId = crypto.randomUUID();
      db.run(
        'INSERT INTO trusted_devices (user_id, device_id, user_agent, is_trusted) VALUES (?, ?, ?, ?)',
        [userId, deviceId, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 1]
      );

      db.run(
        'INSERT INTO login_entries (timestamp, user_id, login, page) VALUES (?, ?, ?, ?)',
        ['2023-11-14T12:40:00', userId, 'user123', 'Twitter']
      );

      await fs.mkdir(path.join('files', userId), { recursive: true });
      await fs.writeFile(path.join('files', userId, 'p1.txt'), 'password123');
    }
  });
};

module.exports = { db, initDB, populateInitialData };