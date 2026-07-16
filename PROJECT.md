# Vellimalai Mushroom Farm UI

Customer storefront and light admin for **Vellimalai Mushroom Farm** (Tamil Nadu): sell fresh mushrooms online, accept Razorpay payments, capture bulk/B2B leads, promote farming training, and manage products/orders.

Repo package name: `mushroom-farming-ui` · Brand site: [vellimalaifarms.in](https://vellimalaifarms.in)

---

## Stack

| Layer | Choice |
|---|---|
| App | Next.js 16 (App Router), React 19, TypeScript |
| Database | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| Auth | NextAuth v4 (Credentials + bcrypt), roles `USER` / `ADMIN` |
| Payments | Razorpay |
| UI | Tailwind CSS 4, shadcn (Base UI), lucide-react, framer-motion, Swiper |
| Forms | react-hook-form, zod |
| Client state | Zustand (cart / wishlist) |
| Data fetching | TanStack React Query |

---

## Features

### Storefront

| Route | Purpose |
|---|---|
| `/` | Marketing home |
| `/shop`, `/shop/[slug]` | Catalog and product detail |
| `/cart`, `/checkout` | Cart and checkout (auth required to place orders) |
| `/orders`, `/track-order` | Customer orders and public tracking |
| `/wishlist`, `/compare` | Wishlist and product compare |
| `/login`, `/register` | Credentials auth |
| `/bulk-orders` | B2B inquiry form |
| `/training` | Farming training programs |
| `/gallery` | Farm media |
| `/about`, `/contact`, `/privacy`, `/terms` | Content and legal |

### Admin (`ADMIN` only)

| Route | Purpose |
|---|---|
| `/admin` | Dashboard (orders, users, products, revenue) |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |

### API (`app/api/(storefront)/`)

- `auth/[...nextauth]` — NextAuth
- `register` — signup
- `orders/create`, `orders/verify`, `orders/track` — Razorpay + tracking
- `bulk-orders` — B2B inquiry

---

## Architecture

```
app/
  (storefront)/     # public site (Navbar / Footer layout)
  admin/            # ADMIN-only dashboard
  api/(storefront)/ # route handlers
components/         # feature components + shadcn ui
lib/                # auth, prisma, razorpay, zustand store, seed data
prisma/             # schema.prisma, seed.ts
public/gallery/     # farm / product media
types/              # NextAuth session typing
```

- Catalog and admin pages use Server Components + Prisma.
- Cart and wishlist persist on the client with Zustand (DB models also exist for cart/wishlist).
- Admin access is gated in `app/admin/layout.tsx` via `getServerSession` (no `middleware.ts`).
- Seed content lives in `lib/data.ts` and is applied by `prisma/seed.ts`.

For Next.js 16 API/convention changes in this repo, see `AGENTS.md` and `node_modules/next/dist/docs/`.

---

## Data model

PostgreSQL · UUID primary keys · URL from `DATABASE_URL` via `prisma.config.ts`

**Enums:** `Role`, `OrderStatus`, `PaymentStatus`, `TrainingStatus`

| Model | Role |
|---|---|
| `User`, `Account`, `Session`, `VerificationToken` | Auth / NextAuth |
| `Address` | Shipping / profile addresses |
| `Category`, `Product` | Catalog (images, stock, featured, highlights) |
| `Order`, `OrderItem` | Checkout; Razorpay IDs; shipping as JSON string |
| `CartItem`, `Wishlist` | Server-side cart / wishlist |
| `Review` | Product reviews (admin approval flag) |
| `Gallery` | Media items |
| `Training`, `TrainingRegistration` | Programs and registrations |
| `BulkOrder` | B2B lead form |
| `Coupon` | Discounts |
| `Setting` | Key/value config |
| `Notification` | User notifications |

---

## Environment

Create a `.env` in the project root (do not commit secrets):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth JWT/session secret |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `RAZORPAY_KEY_ID` | Razorpay key id (server) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (server) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key id (client checkout) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID (required for SMS/WhatsApp) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token (required for SMS/WhatsApp) |
| `TWILIO_SMS_FROM` | Twilio SMS sender number (e.g. `+1xxxxxxxxxx`) |
| `TWILIO_WHATSAPP_FROM` | Twilio WhatsApp sender (e.g. `+1xxxxxxxxxx`) |
| `APP_BASE_URL` | Public app URL for tracking links in notifications |

---

## Local setup

```bash
npm install

# Generate client and sync schema
npx prisma generate
npx prisma db push

# Optional seed (categories, products, training from lib/data.ts)
npx prisma db seed

npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

| Script | Command |
|---|---|
| Dev | `npm run dev` |
| Production build | `npm run build` then `npm run start` |
| Lint | `npm run lint` |

---

## Production checklist (SMS / WhatsApp)

1. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`, and `TWILIO_WHATSAPP_FROM` in the production `.env`.
2. Enable the WhatsApp sender in the Twilio console (request a WhatsApp-enabled number or connect your business profile).
3. Verify `APP_BASE_URL` is set to the public domain (e.g. `https://vellimalaifarms.in`) so order tracking links appear in notifications.
4. The test OTP bypass (`1234`) is disabled in production (`NODE_ENV=production`). OTP delivery requires Twilio credentials.
5. `devOtp` is never returned in API responses when `NODE_ENV=production`.

---

## Notes for contributors

- Prefer matching existing patterns in `app/`, `components/`, and `lib/` over introducing new abstractions.
- Keep auth and payment secrets server-side only; only `NEXT_PUBLIC_*` keys belong in the browser.
- Admin UI assumes a user with `role = ADMIN` in the database.
