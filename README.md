# Electronic Store

A small electronics e-commerce app built with Nuxt 3 (Vue 3), Tailwind CSS,
Prisma, and JWT authentication.

## Features

- **Auth**: register / login / logout, passwords hashed with bcrypt, session
  stored in an http-only JWT cookie.
- **Roles**: `admin` (full access), `staff` (manage products + orders),
  `guest` (browse + cart, must log in to check out).
- **Products**: list, search, filter by category, detail page, full CRUD
  from the dashboard (staff/admin).
- **Cart**: add/remove/update quantity, saved to `localStorage`.
- **Orders**: logged-in users check out from their cart; staff/admin see and
  update all orders from the dashboard.

## Tech stack

| Layer     | Choice                                   |
|-----------|-------------------------------------------|
| Frontend  | Nuxt 4 (Vue 3, Composition API)            |
| Styling   | Tailwind CSS (`@nuxtjs/tailwindcss`)       |
| State     | Pinia (`app/stores/auth.js`, `cart.js`)    |
| Backend   | Nuxt server API (`server/api/**`)          |
| Database  | PostgreSQL (or MySQL) via Prisma ORM       |
| Auth      | JWT in an http-only cookie + bcrypt hashes |

## Folder structure

```
app/
  app.vue
  pages/            index, login, register, products/[id], cart, dashboard
  components/       Navbar, ProductCard, ProductForm
  layouts/          default.vue
  middleware/       auth.js, role.js
  stores/           auth.js, cart.js   (Pinia)
server/
  api/
    auth/           register, login, logout, me
    products/       list/create + [id] get/put/delete
    categories/      list/create
    users/          list (admin) + [id] update role (admin)
    orders/         list/create + [id] update status
  utils/            db.js (Prisma client), auth.js (JWT/bcrypt helpers)
prisma/
  schema.prisma     users, categories, products, orders, order_items
  seed.mjs          creates an admin user + demo products
```

## 1. Install dependencies

```bash
npm install
```

## 2. Configure the database

Copy `.env.example` to `.env` and set `DATABASE_URL` to a real PostgreSQL
(or MySQL) connection string, and `JWT_SECRET` to a random string.

```bash
cp .env.example .env
```

To use MySQL instead of PostgreSQL, just change `provider = "postgresql"`
to `provider = "mysql"` in `prisma/schema.prisma` — nothing else changes.

## 3. Create the database tables

```bash
npx prisma migrate dev --name init
```

## 4. (Optional) Seed demo data

Creates an admin login (`admin@example.com` / `admin123`) plus two sample
products:

```bash
npm run db:seed
```

## 5. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Roles at a glance

| Action                    | admin | staff | guest |
|----------------------------|:-----:|:-----:|:-----:|
| Browse / view products     |  ✅   |  ✅   |  ✅   |
| Add to cart                |  ✅   |  ✅   |  ✅   |
| Checkout                   |  ✅   |  ✅   |  ❌ (must log in) |
| Create/edit/delete products|  ✅   |  ✅   |  ❌   |
| Manage categories          |  ✅   |  ❌   |  ❌   |
| View/update all orders     |  ✅   |  ✅   |  ❌   |
| Manage users & roles       |  ✅   |  ❌   |  ❌   |

New sign-ups always start as `guest`. Promote someone to `staff` or `admin`
from the dashboard's **Users** tab (admin only), or directly in the
database.
