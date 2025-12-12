import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with password:', password ? '***' : '(empty)');
    console.log('Password length:', password.length);
    console.log('Password first 3 chars:', password.substring(0, 3));
    
    try {
      const result = await login(password);
      console.log('Login result:', result);
      
      if (result && result.success) {
        navigate('/admin');
      } else {
        setError(result?.error || 'Неверный логин или пароль');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка при входе. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-form">
          <h1>Вход в админ панель</h1>
          <p>PARADISE_SHOP</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => {
                  console.log('Password input changed:', e.target.value ? '***' : '(empty)');
                  setPassword(e.target.value);
                }}
                onPaste={(e) => {
                  const pastedText = e.clipboardData.getData('text');
                  console.log('Password pasted:', pastedText ? '***' : '(empty)');
                }}
                autoComplete="new-password"
                required
              />
            </div>
            
            {error && <div className="error">{error}</div>}
            
            <button type="submit" className="login-btn">Войти</button>
          </form>
          
          <div className="login-info">
            <p>Данные для входа:</p>
            <p>Пароль: paradise251208</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
