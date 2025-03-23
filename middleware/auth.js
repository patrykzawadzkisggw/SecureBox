const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const SECRET_KEY = 'your-secret-key';
const TOKEN_EXPIRATION_MINUTES = 30;

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ detail: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) return res.status(401).json({ detail: 'Invalid or expired token' });

    const userId = payload.user_id;
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err || !user) return res.status(401).json({ detail: 'User not found' });
      req.user = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        login: user.login,
        password: user.password,
      };
      next();
    });
  });
};

module.exports = { authenticateToken, SECRET_KEY, TOKEN_EXPIRATION_MINUTES };