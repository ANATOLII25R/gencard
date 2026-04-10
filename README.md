# GenCard 🎨⚡

> **SaaS-платформа для створення професійних флаєрів, постерів та графіки** — прямо в браузері. Без дизайнерського досвіду.

**Автор:** Anatolii Spagna · [@ANATOLII25R](https://github.com/ANATOLII25R)

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-336791?logo=postgresql)

---

## 🏗️ Стек технологій

### Frontend
| Технологія | Версія | Призначення |
|---|---|---|
| **Next.js** | 16.2 | React фреймворк (App Router + Server Components) |
| **React** | 19 | UI бібліотека |
| **TypeScript** | 5.x | Типізована мова |
| **Tailwind CSS** | 4.x | Стилізація |
| **Fabric.js** | 6.x | Canvas-редактор (drag & drop, об'єкти, малювання) |
| **Lucide React** | 1.x | Іконки |

### Backend / API
| Технологія | Версія | Призначення |
|---|---|---|
| **Next.js API Routes** | 16.2 | REST API маршрути |
| **NextAuth.js (Auth.js)** | 5.x beta | Автентифікація (GitHub OAuth + Email/Password) |
| **Prisma ORM** | 7.x | Робота з базою даних |
| **@prisma/adapter-pg** | 7.x | Адаптер PostgreSQL для Node.js |
| **bcryptjs** | 3.x | Хешування паролів |

### База даних
| Технологія | Призначення |
|---|---|
| **PostgreSQL** (Neon.tech) | Основна база даних в хмарі |
| **Neon Serverless** | Безсерверний PostgreSQL з connection pooling |

### Платежі
| Технологія | Призначення |
|---|---|
| **Stripe** | Підписки (FREE / PRO / BUSINESS) |
| **@stripe/stripe-js** | Клієнтська частина Stripe |

---

## 📁 Структура проекту

```
flyer-saas/
│
├── app/                          ← Next.js App Router
│   ├── layout.tsx                ← Root layout (шрифти, meta)
│   ├── page.tsx                  ← Лендінг (Hero, Features, Pricing)
│   ├── globals.css               ← CSS змінні, теми, анімації
│   │
│   ├── dashboard/                ← Приватна екосистема користувача
│   │   ├── page.tsx              ← Server Component (завантаження даних + кеш)
│   │   └── DashboardClient.tsx   ← Client Component (UI, tabs, sidebar)
│   │
│   ├── editor/[id]/              ← Canvas-редактор флаєрів
│   │   └── page.tsx
│   │
│   ├── accedi/                   ← Публічна сторінка входу (legacy)
│   │   └── page.tsx
│   │
│   ├── prezzi/                   ← Сторінка цін
│   │   └── page.tsx
│   │
│   ├── account/                  ← Профіль користувача
│   │   └── page.tsx
│   │
│   ├── actions/                  ← Server Actions
│   │   └── auth.ts               ← Реєстрація Email/Password
│   │
│   └── api/                      ← REST API
│       ├── auth/[...nextauth]/   ← NextAuth обробник
│       └── progetti/             ← CRUD проектів
│           ├── route.ts          ← GET, POST
│           └── [id]/route.ts     ← PUT (зберегти), DELETE
│
├── components/
│   ├── landing/                  ← Компоненти лендінгу
│   │   ├── Header.tsx            ← Навігація + Модальне вікно Auth
│   │   ├── Hero.tsx              ← Головний банер
│   │   ├── Features.tsx          ← Переваги
│   │   ├── Pricing.tsx           ← Ціни та тарифи
│   │   └── Footer.tsx            ← Підвал
│   │
│   └── editor/                   ← Компоненти редактора
│       ├── CanvasEditor.tsx      ← Fabric.js canvas (drag & drop)
│       └── Toolbar.tsx           ← Панель інструментів
│
├── lib/
│   ├── prisma.ts                 ← Prisma Client (pg адаптер)
│   ├── auth.ts                   ← NextAuth конфігурація
│   └── stripe.ts                 ← Stripe клієнт
│
├── prisma/
│   ├── schema.prisma             ← БД моделі (User, Project, Subscription…)
│   └── migrations/               ← SQL міграції
│
├── types/
│   └── index.ts                  ← TypeScript типи (Project, PlanType…)
│
├── middleware.ts                 ← Захист маршрутів (JWT Edge-compatible)
├── prisma.config.ts              ← Prisma 7 конфігурація
├── .env.local                    ← Секретні ключі (не в git!)
├── next.config.ts                ← Next.js конфігурація
└── tailwind.config.ts            ← Tailwind конфігурація
```

---

## 🗄️ Схема бази даних

```
User ──────┬── Account (OAuth: GitHub)
           ├── Session (JWT)
           ├── Project[] (флаєри та дизайни)
           └── Subscription (FREE / PRO / BUSINESS)
```

### Моделі
- **User** — профіль, email, пароль (bcrypt), зображення
- **Account** — OAuth провайдери
- **Session** — активні сесії
- **Project** — ім'я, canvasData (JSON), thumbnail, розміри
- **Subscription** — план, Stripe ID, дата закінчення

---

## 🔐 Автентифікація

Підтримується два методи входу:
1. **GitHub OAuth** — швидкий вхід через GitHub аккаунт
2. **Email + Password** — самостійна реєстрація з bcrypt хешуванням

JWT-стратегія сесій, Edge-сумісний Middleware для захисту маршрутів.

---

## 💰 Плани підписок

| План | Проекти | Export | Ціна |
|---|---|---|---|
| **FREE** | 3 | PNG | Безкоштовно |
| **PRO** | Необмежено | PNG + PDF | ~€9/міс |
| **BUSINESS** | Необмежено | Все + Brand Kit | ~€29/міс |

---

## 🚀 Запуск локально

```bash
# 1. Встанови залежності
npm install

# 2. Створи .env.local (заповни всі змінні)
cp .env.example .env.local

# 3. Згенеруй Prisma клієнт
npx prisma generate

# 4. Синхронізуй схему з БД
npx prisma db push

# 5. Запусти сервер розробки
npm run dev
```

Відкрий [http://localhost:3000](http://localhost:3000)

---

## 🔧 Змінні середовища (.env.local)

```env
DATABASE_URL="postgresql://..."     # Neon PostgreSQL URL
AUTH_SECRET="..."                   # NextAuth секрет
NEXTAUTH_SECRET="..."               # Alias для NextAuth
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 📦 Основні залежності

```json
{
  "next": "16.2.3",
  "react": "19.2.4",
  "next-auth": "^5.0.0-beta.30",
  "prisma": "^7.7.0",
  "@prisma/client": "^7.7.0",
  "@prisma/adapter-pg": "^7.7.0",
  "pg": "^8.x",
  "fabric": "^6.9.1",
  "bcryptjs": "^3.0.3",
  "stripe": "^22.0.1",
  "lucide-react": "^1.7.0"
}
```

---

## 🎨 Дизайн-система

Тема **Dashdark X** — глибокі космічні кольори:
- `#080B12` — основний фон
- `#111827` — картки
- `#6366F1` — акцент (Indigo)
- `#F8FAFC` — основний текст
- `#94A3B8` — другорядний текст

---

*Створено з ❤️ за допомогою AI. Розроблено для малого бізнесу Італії та всього світу.*
