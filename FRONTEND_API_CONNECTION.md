# 🔗 Frontend + API Connection Guide

## 🎯 Как это работает на Vercel

Когда ты деплоишь на Vercel, и фронтенд, и API работают на **одном домене**:

```
https://your-app.vercel.app/
├── /              → React фронтенд
├── /api/*         → Node.js API  
├── /admin/*       → Админ панель API
└── /health        → Health check
```

## 📡 Текущая настройка

### API URL в клиенте
```javascript
// client/src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Environment Variable
```bash
# client/.env
VITE_API_URL=/api
```

## 🚀 Как это работает вместе

### 1. Деплой на Vercel
- Фронтенд (React) деплоится как статические файлы
- API (Node.js) деплоится как serverless functions
- Оба работают на одном домене

### 2. Роутинг в vercel.json
```json
{
  "routes": [
    {"src": "/api/(.*)", "dest": "/server/server.js"},
    {"src": "/admin/(.*)", "dest": "/server/server.js"},
    {"src": "/(.*)", "dest": "/client/$1"}
  ]
}
```

### 3. Запросы из фронтенда
```javascript
// Это будет работать автоматически
fetch('/api/products')  // → https://your-app.vercel.app/api/products
fetch('/api/orders')    // → https://your-app.vercel.app/api/orders
```

## 🔧 Что нужно сделать

### 1. Environment Variables в Vercel
Добавь в настройках проекта Vercel:
```
VITE_API_URL=/api
DATABASE_URL=postgresql://postgres:password@project.supabase.co:5432/postgres
NODE_ENV=production
JWT_SECRET=your-secret-key
```

### 2. Локальная разработка
```bash
# Создай .env файл в client/
cd client
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Запуск
npm run dev  # фронтенд на localhost:5173
cd ../server && npm run dev  # API на localhost:3000
```

## ✅ Проверка работы

После деплоя проверь:
1. **Фронтенд**: `https://app.vercel.app/`
2. **API**: `https://app.vercel.app/api/products`
3. **Health**: `https://app.vercel.app/health`

## 🌟 Преимущества

- **Нет CORS проблем** - один домен
- **Простые URL** - относительные пути
- **Автоматический деплой** - один репозиторий
- **Бесплатно** - Vercel + Supabase

## 🚨 Важно

- Не используй абсолютные URL в клиенте
- Все API запросы должны быть относительными (`/api/...`)
- Environment variables должны начинаться с `VITE_` для Vite

---

**Готово! Твой фронтенд и API работают вместе на Vercel! 🎉**
