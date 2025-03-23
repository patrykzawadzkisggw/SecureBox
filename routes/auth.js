const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET_KEY, TOKEN_EXPIRATION_MINUTES } = require('../middleware/auth');

router.post('/', (req, res) => {
  const { login, password } = req.body;
  User.findByLoginAndPassword(login, password, (err, user) => {
    if (err || !user) return res.status(401).json({ detail: 'Invalid login or password' });
    const token = jwt.sign(
      { user_id: user.id },
      SECRET_KEY,
      { expiresIn: `${TOKEN_EXPIRATION_MINUTES}m` }
    );
    res.json({
      user: { id: user.id, first_name: user.first_name, last_name: user.last_name, login: user.login },
      token,
    });
  });
});

module.exports = router;