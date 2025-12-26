const express = require('express');
const router = express.Router();

// Временное хранилище заказов
let orders = [
  { id: 1, customer: 'User1', items: 2, total: 50, status: 'pending', date: '26.12.2024' },
  { id: 2, customer: 'User2', items: 1, total: 25, status: 'completed', date: '26.12.2024' }
];

let nextOrderId = 3;

// GET /api/orders - получить все заказы
router.get('/', (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /api/orders/:id/status - обновить статус заказа
router.put('/:id/status', (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    orders[orderIndex].status = status;
    res.json(orders[orderIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
