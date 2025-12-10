import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, isAdmin, login, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { currentUser } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (login('admin', password)) {
      setShowLoginModal(false);
      setPassword('');
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            PARADISE_SHOP
          </Link>
          <div className="header-actions">
            <Link to="/cart" className="cart-link">
              Корзина ({getTotalItems()})
            </Link>
            {currentUser && (
              <Link to="/profile" className="admin-link">
                Личный кабинет
              </Link>
            )}
            {isAuthenticated && isAdmin ? (
              <>
                <Link to="/admin" className="admin-link">
                  Админ панель
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Выйти
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="login-btn"
              >
                Вход
              </button>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && (
        <div className="login-modal">
          <div className="login-modal-content">
            <h3>Вход для администратора</h3>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <div className="error">{error}</div>}
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  Войти
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowLoginModal(false);
                    setPassword('');
                    setError('');
                  }}
                  className="cancel-btn"
                >
                  Отмена
                </button>
              </div>
            </form>
            <div className="login-hint">
              <p>Подсказка: спроси у администратора</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
