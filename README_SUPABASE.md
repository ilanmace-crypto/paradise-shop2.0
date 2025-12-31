# Paradise Shop API - Supabase Version

🛍️ **API для магазина вейп-продуктов с базой данных Supabase**

## ✨ Особенности
- ✅ **Полностью бесплатно** с Supabase (500MB БД)
- ✅ **Быстрый деплой** на Railway/Vercel
- ✅ **Автоматический backup** данных
- ✅ **Real-time API** из коробки
- ✅ **Безопасность** с RLS

## 🚀 Быстрый старт

### 1. Создай Supabase проект
```bash
# Зайди на supabase.com и создай проект
# Название: paradise-shop-api
```

### 2. Загрузи схему БД
```sql
-- Скопируй содержимое database_schema.sql в SQL Editor Supabase
```

### 3. Деплой API
```bash
# Fork репозиторий и деплой на Railway
# Или импортируй в Vercel
```

## 📡 API Endpoints

### Products
- `GET /api/products` - Все товары
- `GET /api/products/:id` - Товар по ID
- `POST /api/products` - Создать товар (admin)

### Orders
- `GET /api/orders` - Заказы пользователя
- `POST /api/orders` - Создать заказ
- `PUT /api/orders/:id/status` - Обновить статус (admin)

### Users
- `POST /api/users/register` - Регистрация
- `POST /api/users/login` - Вход

### Admin
- `POST /admin/login` - Вход админа
- `GET /admin/stats` - Статистика

## 🔧 Конфигурация

### Переменные окружения
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres
JWT_SECRET=your-secret-key
PORT=3000
```

## 🏗️ Структура проекта
```
├── server/
│   ├── server.js          # Main server
│   ├── config/
│   │   └── supabase.js    # Supabase connection
│   └── routes/            # API routes
├── database_schema.sql    # База данных
└── client/               # React frontend
```

## 📦 Деплой

### Railway (рекомендуется)
1. Fork репозиторий
2. Добавь проект в Railway
3. Установи `DATABASE_URL`
4. Deploy! 🎉

### Vercel
1. Import repository
2. Add Environment Variables
3. Deploy

## 💰 Стоимость
- **Supabase**: $0/мес (500MB БД)
- **Railway**: $0/мес (500 часов)
- **Vercel**: $0/мес (100GB bandwidth)

**Итого: $0 в месяц!** 🆓

## 🛡️ Безопасность
- Row Level Security (RLS) в Supabase
- JWT токены для авторизации
- Rate limiting
- CORS защита

## 📞 Поддержка
- Документация: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Issues: GitHub Issues

---

**Сделано с ❤️ для Paradise Shop**
