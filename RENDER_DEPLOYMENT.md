# Развертывание на Render.com

## 1. Backend развертывание

### Шаг 1: Создай Web Service на Render
1. Зайди на https://render.com
2. Нажми "New +" → "Web Service"
3. Выбери репозиторий paradise-shop
4. Настройки:
   - Name: paradise-shop-api
   - Environment: Node
   - Build Command: cd server && npm install && npm run init-db
   - Start Command: cd server && npm start
   - Instance Type: Free

### Шаг 2: Переменные окружения
- PORT = 10000
- NODE_ENV = production

### Шаг 3: Health Check
- Path: /api/health
- Check interval: 30s

## 2. Frontend на Vercel

### Переменные окружения:
- REACT_APP_API_URL = https://paradise-shop-api.onrender.com/api

## 3. Проверка
1. API: https://paradise-shop-api.onrender.com/api/health
2. Frontend: твой домен на Vercel
3. Админ панель должна работать

## Готово!
