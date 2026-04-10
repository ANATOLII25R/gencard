# GenCard 🎨⚡

> **Piattaforma SaaS per la creazione di volantini, poster e grafica professionale** — direttamente nel browser. Senza esperienza di design.

**Autore:** Anatolii Spagna · [@ANATOLII25R](https://github.com/ANATOLII25R)

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-336791?logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)

---

## 🏗️ Stack Tecnologico

### Frontend
| Tecnologia | Versione | Utilizzo |
|---|---|---|
| **Next.js** | 16.2 | Framework React (App Router + Server Components) |
| **React** | 19 | Libreria UI |
| **TypeScript** | 5.x | Linguaggio tipizzato |
| **Tailwind CSS** | 4.x | Stile e design |
| **Fabric.js** | 6.x | Editor Canvas (drag & drop, oggetti, disegno) |
| **Lucide React** | 1.x | Icone |

### Backend / API
| Tecnologia | Versione | Utilizzo |
|---|---|---|
| **Next.js API Routes** | 16.2 | Rotte REST API |
| **NextAuth.js (Auth.js)** | 5.x beta | Autenticazione (GitHub OAuth + Email/Password) |
| **Prisma ORM** | 7.x | Gestione del database |
| **@prisma/adapter-pg** | 7.x | Adattatore PostgreSQL per Node.js |
| **bcryptjs** | 3.x | Hashing delle password |

### Database
| Tecnologia | Utilizzo |
|---|---|
| **PostgreSQL** (Neon.tech) | Database principale in cloud |
| **Neon Serverless** | PostgreSQL serverless con connection pooling |

### Pagamenti
| Tecnologia | Utilizzo |
|---|---|
| **Stripe** | Abbonamenti (FREE / PRO / BUSINESS) |
| **@stripe/stripe-js** | Integrazione lato client |

---

## 📁 Struttura del Progetto

```
flyer-saas/
│
├── app/                          ← Next.js App Router
│   ├── layout.tsx                ← Layout principale (font, meta SEO)
│   ├── page.tsx                  ← Landing page (Hero, Funzionalità, Prezzi)
│   ├── globals.css               ← Variabili CSS, tema, animazioni
│   │
│   ├── dashboard/                ← Ecosistema privato dell'utente
│   │   ├── page.tsx              ← Server Component (caricamento dati + cache)
│   │   └── DashboardClient.tsx   ← Client Component (UI, tab, sidebar)
│   │
│   ├── editor/[id]/              ← Editor Canvas per i design
│   │   └── page.tsx
│   │
│   ├── accedi/                   ← Pagina di accesso (legacy)
│   │   └── page.tsx
│   │
│   ├── prezzi/                   ← Pagina dei prezzi
│   │   └── page.tsx
│   │
│   ├── account/                  ← Profilo utente
│   │   └── page.tsx
│   │
│   ├── actions/                  ← Server Actions
│   │   └── auth.ts               ← Registrazione Email/Password
│   │
│   └── api/                      ← API REST
│       ├── auth/[...nextauth]/   ← Gestore NextAuth
│       └── progetti/             ← CRUD dei progetti
│           ├── route.ts          ← GET, POST
│           └── [id]/route.ts     ← PUT (salva), DELETE
│
├── components/
│   ├── landing/                  ← Componenti della landing page
│   │   ├── Header.tsx            ← Navigazione + Modale di autenticazione
│   │   ├── Hero.tsx              ← Banner principale
│   │   ├── Features.tsx          ← Funzionalità
│   │   ├── Pricing.tsx           ← Prezzi e abbonamenti
│   │   └── Footer.tsx            ← Piè di pagina
│   │
│   └── editor/                   ← Componenti dell'editor
│       ├── CanvasEditor.tsx      ← Canvas Fabric.js (drag & drop)
│       └── Toolbar.tsx           ← Barra degli strumenti
│
├── lib/
│   ├── prisma.ts                 ← Prisma Client (adattatore pg)
│   ├── auth.ts                   ← Configurazione NextAuth
│   └── stripe.ts                 ← Client Stripe
│
├── prisma/
│   ├── schema.prisma             ← Modelli del database
│   └── migrations/               ← Migrazioni SQL
│
├── types/
│   └── index.ts                  ← Tipi TypeScript (Project, PlanType…)
│
├── middleware.ts                 ← Protezione delle rotte (JWT Edge-compatible)
├── prisma.config.ts              ← Configurazione Prisma 7
├── .env.local                    ← Chiavi private (non incluso nel git!)
├── .env.example                  ← Template variabili d'ambiente
├── next.config.ts                ← Configurazione Next.js
└── tailwind.config.ts            ← Configurazione Tailwind
```

---

## 🗄️ Schema del Database

```
Utente ────┬── Account (OAuth: GitHub)
           ├── Sessione (JWT)
           ├── Progetto[] (volantini e design)
           └── Abbonamento (FREE / PRO / BUSINESS)
```

### Modelli
- **User** — profilo, email, password (bcrypt), immagine
- **Account** — provider OAuth
- **Session** — sessioni attive
- **Project** — nome, canvasData (JSON), thumbnail, dimensioni
- **Subscription** — piano, Stripe ID, data di scadenza

---

## 🔐 Autenticazione

Sono supportati due metodi di accesso:
1. **GitHub OAuth** — accesso rapido tramite account GitHub
2. **Email + Password** — registrazione autonoma con hashing bcrypt

Strategia sessioni JWT, Middleware Edge-compatibile per la protezione delle rotte.

---

## 💰 Piani di Abbonamento

| Piano | Progetti | Export | Prezzo |
|---|---|---|---|
| **FREE** | 3 | PNG | Gratuito |
| **PRO** | Illimitati | PNG + PDF | ~€9/mese |
| **BUSINESS** | Illimitati | Tutto + Brand Kit | ~€29/mese |

---

## 🚀 Avvio in Locale

```bash
# 1. Installa le dipendenze
npm install

# 2. Crea il file .env.local (compila tutte le variabili)
cp .env.example .env.local

# 3. Genera il client Prisma
npx prisma generate

# 4. Sincronizza lo schema con il database
npx prisma db push

# 5. Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## 🔧 Variabili d'Ambiente (.env.local)

```env
DATABASE_URL="postgresql://..."     # URL Neon PostgreSQL
AUTH_SECRET="..."                   # Segreto NextAuth
NEXTAUTH_SECRET="..."               # Alias per NextAuth
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 📦 Dipendenze Principali

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

## 🎨 Sistema di Design

Tema **Dashdark X** — colori profondi e scuri:
- `#080B12` — sfondo principale
- `#111827` — sfondo schede
- `#6366F1` — colore accento (Indigo)
- `#F8FAFC` — testo principale
- `#94A3B8` — testo secondario

---

*Creato con ❤️ con l'aiuto dell'intelligenza artificiale. Progettato per le piccole imprese italiane e di tutto il mondo.*
