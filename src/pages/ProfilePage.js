import React from 'react';
import './ProfilePage.css';
import { useUser } from '../context/UserContext';

const ProfilePage = () => {
  const { currentUser, users, getUserOrders } = useUser();

  if (!currentUser) {
    return (
      <div className="profile-page">
        <div className="container">
          <h1 className="profile-title">Личный кабинет</h1>
          <p className="profile-muted">Аккаунт ещё не создан. Оформите заказ с указанием Telegram юзернейма, чтобы мы могли привязать ваши покупки.</p>
        </div>
      </div>
    );
  }

  const orders = getUserOrders(currentUser.id);
  const referredUsers = Object.values(users || {}).filter(
    (u) => u.referredBy === currentUser.id
  );

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const refLink = `${baseUrl}/?ref=${encodeURIComponent(currentUser.id)}${currentUser.telegramUsername ? `&tg_username=${encodeURIComponent(currentUser.telegramUsername)}` : ''}`;

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="profile-title">Личный кабинет</h1>

        <section className="profile-section">
          <h2 className="profile-section-title">Ваш аккаунт</h2>
          <div className="profile-card">
            <div className="profile-row">
              <span className="profile-label">Telegram:</span>
              <span className="profile-value">
                {currentUser.telegramUsername ? `@${currentUser.telegramUsername}` : 'не указан'}
              </span>
            </div>
            <div className="profile-row">
              <span className="profile-label">ID пользователя:</span>
              <span className="profile-value profile-value-mono">{currentUser.id}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Реферальный код:</span>
              <span className="profile-value profile-value-mono">{currentUser.refCode}</span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2 className="profile-section-title">Реферальная программа</h2>
          <div className="profile-card">
            <div className="profile-row">
              <span className="profile-label">Приглашено людей:</span>
              <span className="profile-value">{referredUsers.length}</span>
            </div>
            <div className="profile-row profile-row-column">
              <span className="profile-label">Ваша ссылка:</span>
              <span className="profile-value profile-value-mono profile-ref-link">{refLink}</span>
              <span className="profile-hint">Отправь эту ссылку другу. При переходе по ней мы автоматически привяжем его аккаунт к тебе.</span>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2 className="profile-section-title">История заказов</h2>
          {orders.length === 0 ? (
            <p className="profile-muted">У вас пока нет заказов.</p>
          ) : (
            <div className="orders-list">
              {orders
                .slice()
                .reverse()
                .map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">Заказ #{order.id}</span>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="order-meta">
                      <span>Сумма: {order.totalPrice.toFixed(2)} BYN</span>
                      <span>
                        Оплата:{' '}
                        {order.paymentMethod === 'card'
                          ? 'Карта'
                          : 'Наличные'}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={`${order.id}-${idx}`} className="order-item">
                          <div className="order-item-main">
                            <span className="order-item-name">{item.name}</span>
                            {item.flavor && (
                              <span className="order-item-flavor">Вкус: {item.flavor}</span>
                            )}
                          </div>
                          <div className="order-item-meta">
                            <span>
                              {item.price} × {item.quantity}
                            </span>
                            <span className="order-item-total">
                              {(item.price * item.quantity).toFixed(2)} BYN
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
