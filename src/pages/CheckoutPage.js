import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart, checkout } = useCart();
  const { isAuthenticated } = useAuth();
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    telegram: '',
    address: '',
    paymentMethod: 'card',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderData.name || !orderData.phone || !orderData.telegram) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = {
        id: Date.now(),
        items: cartItems,
        total: getTotalPrice(),
        customer: orderData,
        timestamp: new Date().toISOString()
      };

      // Отправка уведомления в Telegram
      await sendTelegramNotification(order);
      
      // Сохранение заказа
      await saveOrder(order);
      
      // Обновление остатков
      checkout();
      
      alert('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
      
      // Очистка формы
      setOrderData({
        name: '',
        phone: '',
        telegram: '',
        address: '',
        paymentMethod: 'card',
        comment: ''
      });
      
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert('Произошла ошибка. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendTelegramNotification = async (order) => {
    const message = `
🛒 НОВЫЙ ЗАКАЗ #${order.id}

👤 Клиент: ${order.customer.name}
📞 Телефон: ${order.customer.phone}
📱 Telegram: @${order.customer.telegram}
📍 Адрес: ${order.customer.address || 'Не указан'}
💳 Способ оплаты: ${order.customer.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
💰 Сумма: ${order.total.toFixed(2)} BYN

📦 Товары:
${order.items.map(item => 
  `• ${item.name}${item.flavor ? ` (${item.flavor})` : ''} - ${item.quantity} шт.`
).join('\n')}

💬 Комментарий: ${order.customer.comment || 'Нет'}

⏰ Время: ${new Date(order.timestamp).toLocaleString('ru-RU')}
    `.trim();

    // Здесь будет реальная отправка в Telegram через API
    console.log('Telegram notification:', message);
    
    // Временное решение - сохранение в localStorage для админа
    const notifications = JSON.parse(localStorage.getItem('telegram_notifications') || '[]');
    notifications.push({
      id: order.id,
      message,
      timestamp: order.timestamp,
      read: false
    });
    localStorage.setItem('telegram_notifications', JSON.stringify(notifications));
  };

  const saveOrder = async (order) => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h1>Оформление заказа</h1>
          <p>Ваша корзина пуста</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Оформление заказа</h1>
        
        <div className="checkout-content">
          <div className="order-summary">
            <h2>Ваш заказ</h2>
            {cartItems.map(item => (
              <div key={`${item.id}-${item.flavor || 'no-flavor'}`} className="checkout-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  {item.flavor && <p className="item-flavor">Вкус: {item.flavor}</p>}
                </div>
                <div className="item-details">
                  <span className="item-quantity">{item.quantity} шт.</span>
                  <span className="item-price">{(item.price * item.quantity).toFixed(2)} BYN</span>
                </div>
              </div>
            ))}
            
            <div className="order-total">
              <strong>Итого: {getTotalPrice().toFixed(2)} BYN</strong>
            </div>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Данные для доставки</h2>
            
            <div className="form-group">
              <label htmlFor="name">Имя *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={orderData.name}
                onChange={handleInputChange}
                required
                placeholder="Ваше имя"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={orderData.phone}
                onChange={handleInputChange}
                required
                placeholder="+375 (XX) XXX-XX-XX"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telegram">Telegram *</label>
              <input
                type="text"
                id="telegram"
                name="telegram"
                value={orderData.telegram}
                onChange={handleInputChange}
                required
                placeholder="@username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Адрес доставки</label>
              <textarea
                id="address"
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
                placeholder="Улица, дом, квартира"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Способ оплаты *</label>
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={orderData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  <span>💳 Карта</span>
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={orderData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                  />
                  <span>💵 Наличные</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Комментарий к заказу</label>
              <textarea
                id="comment"
                name="comment"
                value={orderData.comment}
                onChange={handleInputChange}
                placeholder="Дополнительная информация"
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
