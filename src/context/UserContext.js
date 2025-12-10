import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEYS = {
  users: 'ps_users',
  currentUserId: 'ps_currentUserId',
  orders: 'ps_orders',
};

const UserContext = createContext();

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const generateRefCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Failed to parse localStorage key', key, e);
    return fallback;
  }
};

const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save localStorage key', key, e);
  }
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [orders, setOrders] = useState([]);

  // Инициализация из localStorage + обработка параметров из URL
  useEffect(() => {
    const storedUsers = loadJson(STORAGE_KEYS.users, {});
    const storedCurrentId = localStorage.getItem(STORAGE_KEYS.currentUserId);
    const storedOrders = loadJson(STORAGE_KEYS.orders, []);

    setUsers(storedUsers);
    setCurrentUserId(storedCurrentId || null);
    setOrders(storedOrders);

    try {
      const url = new URL(window.location.href);
      const tgUsernameParam = url.searchParams.get('tg_username') || url.searchParams.get('username');
      const refParam = url.searchParams.get('ref');

      if (tgUsernameParam) {
        const telegramUsername = tgUsernameParam.trim();
        let existingUserId = Object.values(storedUsers).find(
          (u) => u.telegramUsername === telegramUsername
        )?.id;

        let nextUsers = { ...storedUsers };
        let userId = existingUserId;

        if (!existingUserId) {
          userId = generateId();
          const refCode = generateRefCode();

          nextUsers[userId] = {
            id: userId,
            telegramUsername,
            refCode,
            referredBy: refParam || null,
            createdAt: new Date().toISOString(),
          };
        }

        setUsers(nextUsers);
        setCurrentUserId(userId);
        saveJson(STORAGE_KEYS.users, nextUsers);
        localStorage.setItem(STORAGE_KEYS.currentUserId, userId);
      }
    } catch (e) {
      console.error('Failed to init user from URL', e);
    }
  }, []);

  const currentUser = currentUserId ? users[currentUserId] || null : null;

  const updateCurrentUser = (patch) => {
    if (!currentUserId) {
      return;
    }
    setUsers((prev) => {
      const prevUser = prev[currentUserId] || {};
      const updated = { ...prevUser, ...patch };
      const next = { ...prev, [currentUserId]: updated };
      saveJson(STORAGE_KEYS.users, next);
      return next;
    });
  };

  const ensureUserWithTelegram = (telegramUsername) => {
    if (!telegramUsername) return null;
    const normalized = telegramUsername.trim();
    if (!normalized) return null;

    // Если текущий пользователь уже есть - просто обновляем username
    if (currentUserId) {
      updateCurrentUser({ telegramUsername: normalized });
      return { ...users[currentUserId], telegramUsername: normalized };
    }

    const id = generateId();
    const refCode = generateRefCode();
    const newUser = {
      id,
      telegramUsername: normalized,
      refCode,
      referredBy: null,
      createdAt: new Date().toISOString(),
    };

    const nextUsers = { ...users, [id]: newUser };
    setUsers(nextUsers);
    setCurrentUserId(id);
    saveJson(STORAGE_KEYS.users, nextUsers);
    localStorage.setItem(STORAGE_KEYS.currentUserId, id);
    return newUser;
  };

  const addOrder = (order) => {
    setOrders((prev) => {
      const next = [...prev, order];
      saveJson(STORAGE_KEYS.orders, next);
      return next;
    });
  };

  const getUserOrders = (userId) => {
    if (!userId) return [];
    return orders.filter((o) => o.userId === userId);
  };

  const value = {
    currentUser,
    users,
    orders,
    updateCurrentUser,
    ensureUserWithTelegram,
    addOrder,
    getUserOrders,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
