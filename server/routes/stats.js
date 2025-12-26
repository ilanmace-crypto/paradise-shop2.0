const express = require('express');
const router = express.Router();

// GET /api/stats - получить статистику
router.get('/', (req, res) => {
  try {
    const stats = {
      totalOrders: 2,
      totalRevenue: 75,
      totalUsers: 2,
      avgOrderValue: 37.5,
      topProducts: ['PARADISE Liquid 30ml', 'Salt 20mg 30ml']
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
