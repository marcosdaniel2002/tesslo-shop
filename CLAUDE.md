# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Teslo Shop — a Next.js 14 (App Router) e-commerce storefront + admin panel, seeded with Tesla-branded apparel data. Backend uses Prisma 7 over PostgreSQL, auth via Auth.js v5 (NextAuth), state via Zustand, payments via PayPal.

## Setup & commands

```bash
npm install
docker compose up -d              # starts Postgres on localhost:5433 (see docker-compose.yaml)
npx prisma migrate dev --name init
npx prisma generate                # Prisma client is generated into src/generated/prisma, NOT node_modules
npm run seed                        # runs src/seed/seed-database.ts via tsx, wipes and reseeds all tables
npm run dev
npm run build
npm run start
npm run lint
```

There is no test suite configured in this repo.

Copy `.env.template` to `.env` before doing anything — it defines `DATABASE_URL` (must match the Docker Postgres port, 5433), `AUTH_SECRET` (generate via `npx auth`), GitHub/Google OAuth credentials, and PayPal sandbox credentials.

## Architecture

**Prisma client location is non-standard.** The generator output is `src/generated/prisma` (see `prisma/schema.prisma`), not the default `node_modules/.prisma`. Import types from `@/generated/prisma/client` and enums from `@/generated/prisma/enums`, not from `@prisma/client`. Always run `npx prisma generate` after pulling schema changes. The singleton client (with the `PrismaPg` driver adapter) lives in `src/lib/prisma.ts`.

**Route groups.** `src/app/(shop)` holds the storefront + admin pages (grouped so they share `src/app/(shop)/layout.tsx` — TopMenu/SideBar/Footer chrome); `src/app/auth` holds login/register with its own layout. Admin routes (`(shop)/admin/**`) are gated by a server-side check in `admin/layout.tsx` that calls `auth()` and redirects to `/auth/login` if `session.user.role !== "admin"` — there is no middleware.ts, so any new admin route must live under that layout to inherit the guard.

**Auth (`src/auth.ts`).** Auth.js v5 with Credentials (bcrypt-hashed passwords in the `User` table) and GitHub OAuth. The `signIn` callback auto-creates a `User` row for first-time GitHub logins (random password, `emailVerified` set). The `jwt`/`session` callbacks stuff the full Prisma `User` record (minus password) into the token/session, so `session.user` has custom fields like `role` — typed via `next-auth.d.ts` module augmentation.

**Product images are stored on local disk, not Cloudinary**, despite `next.config.mjs` still whitelisting `res.cloudinary.com` for any legacy/seeded remote URLs. Uploaded images: `src/lib/product-images.ts` saves files to `media/products/<uuid>.<ext>` (`media/` is gitignored, outside `public/`), and `src/app/(shop)/products/[...path]/route.ts` serves them back over HTTP with a path-traversal check and long-lived cache headers. `ProductImage.tsx` decides at render time whether a stored `url` is an absolute `http(s)` URL (legacy/seeded Cloudinary asset) or a bare filename (serve from `/products/<filename>` via that route handler) — falls back to `/imgs/placeholder.jpg` otherwise. When adding new product-image logic, preserve this dual-mode behavior rather than assuming all images are local or all are remote.

**Server actions (`src/actions/**`)** are the primary data-mutation layer (`"use server"` files), organized by domain (`address`, `auth`, `category`, `country`, `order`, `payments`, `products`, `user`). Conventions to follow:
- Validate input with Zod schemas built for `FormData` (`Object.fromEntries(formData)`), coercing types as needed (see `create-update-product.ts`).
- Wrap multi-step writes in `prisma.$transaction` (product create/update + image rows; order create + stock decrement + address in `place-order.ts`).
- Return a plain result object (`{ resp/ok: boolean, message/error, data? }`) rather than throwing to the caller — actions catch internally and report failure in the return value.
- Call `revalidatePath(...)` for every route that displays the mutated data.
- Money fields (`price`, `subTotal`, `tax`, `total`) always carry an implicit 15% tax; see `getSummaryInformation` in `src/store/cart.ts` and the tax math duplicated in `place-order.ts` — keep both in sync if the rate ever changes.

**PayPal flow.** Client renders `@paypal/react-paypal-js` (`components/ui/paypal/PayPalButton.tsx`) against `NEXT_PUBLIC_PAYPAL_CLIENT_ID`; server-side verification/capture happens in `src/actions/payments/paypal-payment.ts`, which fetches its own OAuth token via `PAYPAL_OAUTH_URL` and checks order status via `PAYPAL_ORDERS_URL` before marking `Order.isPaid`. The PayPal order's `invoice_id` is expected to equal the internal `Order.id`.

**Client state (Zustand, `src/store/`)**: `cart.ts` (persisted to localStorage as `"shopping-cart"`, keyed by `id + size` for line-item identity), `address.ts` (checkout address draft), `store.ts` (UI-only state like the mobile side menu). Cart totals/tax are computed here on the client and recomputed independently on the server in `place-order.ts` — don't trust client-submitted totals when touching order creation.

**Data model (`prisma/schema.prisma`)**: `Product` belongs to one `Category`, has many `ProductImage`, array fields for `sizes` (enum `Size`) and `tags` (string[]). `Order` → `OrderItem[]` (snapshots `price`/`size` at purchase time) + one `OrderAddress`; `User` → optional one `UserAddress`. `Country` is a shared lookup table referenced by both address types.

**Seeding (`src/seed/`)**: `seed-database.ts` deletes all rows across every table then reinserts from `seed.ts` (product/user fixture data) and `seed-countries.ts`. Treat this as destructive — never point it at a non-throwaway database.

## Conventions

- Path alias `@/*` → `src/*` (see `tsconfig.json`).
- Many in-code comments are in Spanish (e.g. `// REVALIDAR PATHS DE PRODUCTOS`) — match this style when editing those files rather than switching to English mid-file.
- ESLint disables `@typescript-eslint/no-explicit-any`; unused vars/args are only an error if not prefixed with `_`.
- Tailwind CSS for styling throughout; no CSS-in-JS.
