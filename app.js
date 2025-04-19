const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const passwordRoutes = require('./routes/passwords');
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync('./certs/server.key', 'utf8');
const certificate = fs.readFileSync('./certs/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'chrome-extension://klaeffpcfgikkahmjkbjklejbifbcffi',
  'http://localhost:8000',
  'https://securebox.netlify.app'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['*'],
  })
);
app.use(express.json());

app.use('/login', authRoutes);
app.use('/users', userRoutes);
app.use('/passwords', passwordRoutes);

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({ detail: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const server = https.createServer(credentials, app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
