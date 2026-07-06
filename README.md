# Bloom & Petal

Fresh, simple bouquets and floral gifts for everyday and special moments. This React + TypeScript storefront is built with Vite on the frontend and an Express/MongoDB backend.

## Deployment Overview

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## What’s Included

- Customer storefront with products, categories, wishlist, and checkout
- Account dashboard with order history, saved delivery addresses, and recipients
- Admin dashboard with product CRUD, order queue, discount management, reviews, and CMS content editing
- Role-based access control and JWT auth for customers and admins
- Responsive mobile-first UI and polished storefront experience

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Copy environment example

Create a local `.env` file in the project root. Use the variables below:

```env
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
VITE_API_URL=""
```

`VITE_API_URL` can remain empty during local development because the frontend proxies requests to the backend.

### 3. Start the app locally

```bash
npm run dev
```

This runs Vite on `http://localhost:3000` and the backend on `http://localhost:5000` via the proxy.

## Build

```bash
npm run build
```

## Backend Deployment on Render

1. Create a new Render Web Service.
2. Connect your Git repository.
3. Set the build command to:

```bash
npm install && npm run build
```

4. Set the start command to:

```bash
npm start
```

5. Add environment variables on Render:

- `MONGO_URI` – MongoDB Atlas connection string
- `JWT_SECRET` – secret for JWT auth

## Frontend Deployment on Vercel

1. Create a new Vercel project from this Git repository.
2. Set the framework preset to Vite.
3. Add environment variables:

- `VITE_API_URL` – Your Render backend URL, for example `https://your-backend.onrender.com`

4. Deploy.

## Notes

- The frontend uses `VITE_API_URL` to construct backend requests.
- Local development uses the Vite proxy in `vite.config.ts` to forward `/api` to `http://localhost:5000`.
- Keep your `JWT_SECRET` secure in Render and local `.env`.
- No external AI dependencies are required for deployment.
