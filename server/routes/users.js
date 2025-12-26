const express = require('express');
const router = express.Router();

// Временное хранилище пользователей
let users = [
  { id: 1, name: 'User1', email: 'user1@example.com', orders: 2, total: 50 },
  { id: 2, name: 'User2', email: 'user2@example.com', orders: 1, total: 25 }
];

// GET /api/users - получить всех пользователей
router.get('/', (req, res) => {
  try {
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
