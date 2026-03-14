# 🛍️ PREMIUM Men's Fashion Store — JSX Edition

A fully converted, multi-page e-commerce store built with React JSX, React Router,
MongoDB backend, and JazzCash payment integration.

---

## 📁 Project Structure

```
premium-fashion-store/
├── src/                         ← Frontend (React JSX + Vite)
│   ├── api/client.js            ← All backend API calls (Axios)
│   ├── components/
│   │   ├── Header.jsx           ← Fixed nav with React Router links
│   │   ├── Footer.jsx           ← Footer with newsletter subscribe
│   │   ├── Hero.jsx             ← Animated hero section
│   │   ├── ProductCard.jsx      ← Card with Quick Add (size/color picker)
│   │   ├── ProductGrid.jsx      ← Reusable grid with filters + sorting
│   │   ├── ShoppingCart.jsx     ← Slide-out cart drawer
│   │   ├── Checkout.jsx         ← Multi-step checkout (Shipping → Payment → Done)
│   │   └── ThreeDBackground.jsx ← Three.js animated canvas
│   ├── data/products.js         ← 20 products across 7 categories
│   ├── hooks/useCart.jsx        ← Cart context (persists to localStorage)
│   ├── pages/
│   │   ├── HomePage.jsx         ← Landing, featured, new arrivals, banner
│   │   ├── ShopPage.jsx         ← /shop and /shop/:category
│   │   ├── CollectionsPage.jsx  ← /collections — all categories as cards
│   │   ├── ProductDetailPage.jsx← /product/:id — size/color/qty, related items
│   │   ├── AboutPage.jsx        ← /about — team, timeline, values
│   │   ├── ContactPage.jsx      ← /contact — form + FAQ accordion
│   │   ├── OrdersPage.jsx       ← /orders — order tracking by ID or phone
│   │   └── NotFoundPage.jsx     ← 404
│   ├── App.jsx                  ← React Router routes
│   └── main.jsx                 ← Entry point
│
├── backend/                     ← Node.js / Express backend
│   ├── server.js                ← Main Express app
│   ├── config/jazzcash.js       ← JazzCash HMAC-SHA256 payment service
│   ├── models/
│   │   ├── Product.js           ← Mongoose Product schema
│   │   ├── Order.js             ← Mongoose Order schema (full status history)
│   │   └── Subscriber.js        ← Newsletter subscriber schema
│   ├── routes/
│   │   ├── products.js          ← GET/POST/PUT/DELETE /api/products
│   │   ├── orders.js            ← POST/GET /api/orders (+ phone lookup)
│   │   ├── payment.js           ← JazzCash initiate + verify callback
│   │   └── newsletter.js        ← POST /api/newsletter
│   └── .env.example             ← All required env variables
│
├── vite.config.js
├── tailwind.config.js
├── package.json
└── .env.example
```

---

## 🚀 Quick Start

### 1 — Frontend

```bash
# In project root
npm install
cp .env.example .env        # Edit VITE_API_URL if needed
npm run dev                  # http://localhost:3000
```

### 2 — Backend

```bash
cd backend
npm install
cp .env.example .env         # Fill in MongoDB URI + JazzCash credentials
npm run dev                  # http://localhost:5000
```

---

## 🌐 Pages & Routes

| Route                  | Page                  | Description                              |
|------------------------|-----------------------|------------------------------------------|
| `/`                    | Home                  | Hero, categories, featured, new arrivals |
| `/shop`                | Shop                  | All products with filter + sort          |
| `/shop/:category`      | Shop (category)       | shirts, trousers, jackets, shoes, etc.   |
| `/collections`         | Collections           | All categories as visual cards           |
| `/product/:id`         | Product Detail        | Images, size/color picker, related items |
| `/about`               | About                 | Team, timeline, values                   |
| `/contact`             | Contact               | Form + FAQ accordion                     |
| `/orders`              | Order Tracking        | Track by Order ID or phone number        |
| `*`                    | 404                   | Not found page                           |

---

## 🗂️ Categories

| ID           | Label          | Icon |
|--------------|----------------|------|
| `shirts`     | Shirts         | 👔   |
| `trousers`   | Trousers       | 👖   |
| `jackets`    | Jackets        | 🧥   |
| `shoes`      | Shoes          | 👞   |
| `watches`    | Watches        | ⌚   |
| `accessories`| Accessories    | 👜   |
| `kurta`      | Kurta & Shalwar| 🎽   |

---

## 💳 JazzCash Integration

### How it works

1. **User selects JazzCash** in checkout → frontend calls `POST /api/payment/jazzcash`
2. **Backend** builds a signed JazzCash request (HMAC-SHA256) and calls the JazzCash API
3. **JazzCash** charges the user's mobile wallet
4. **JazzCash** POSTs the result to your `JAZZCASH_RETURN_URL` (your backend)
5. **Backend** verifies the secure hash + updates the order status in MongoDB

### Setup

1. Register at https://sandbox.jazzcash.com.pk (sandbox) or https://payments.jazzcash.com.pk (production)
2. Get your **Merchant ID**, **Password**, and **Integrity Salt**
3. Add to `backend/.env`:

```env
JAZZCASH_MERCHANT_ID=MC12345
JAZZCASH_PASSWORD=your_password
JAZZCASH_INTEGRITY_SALT=your_salt
JAZZCASH_RETURN_URL=https://yourdomain.com/api/payment/jazzcash/verify
JAZZCASH_ENV=sandbox
```

4. In production, set `JAZZCASH_ENV=production`

---

## 🍃 MongoDB Setup

### Option A — MongoDB Atlas (Recommended, Free)

1. Go to https://cloud.mongodb.com → create free cluster
2. Create a database user + get the connection string
3. Add to `backend/.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/premium_store
```

### Option B — Local MongoDB

```bash
brew install mongodb-community  # macOS
sudo systemctl start mongod     # Linux
```
```env
MONGODB_URI=mongodb://localhost:27017/premium_store
```

---

## 🔌 API Endpoints

### Products
```
GET    /api/products                 List all (supports: category, sort, featured, newArrival, minPrice, maxPrice, page, limit)
GET    /api/products/:id             Get single product
POST   /api/products                 Create product (admin)
PUT    /api/products/:id             Update product (admin)
DELETE /api/products/:id             Delete product (admin)
```

### Orders
```
POST   /api/orders                   Place new order → returns order with _id
GET    /api/orders                   All orders (admin, supports: page, status)
GET    /api/orders/:id               Get by MongoDB _id or orderId string
GET    /api/orders/by-phone/:phone   Get all orders by customer phone
PATCH  /api/orders/:id/status        Update status (admin)
```

### Payment
```
POST   /api/payment/jazzcash         Initiate JazzCash wallet payment
POST   /api/payment/jazzcash/verify  Verify JazzCash callback (called by JazzCash)
GET    /api/payment/jazzcash/callback Redirect handler for browser return
```

### Newsletter
```
POST   /api/newsletter               Subscribe email
DELETE /api/newsletter/:email        Unsubscribe
```

### Health
```
GET    /api/health                   Server + MongoDB status
```

---

## 🎨 Customization

### Change brand color
```js
// tailwind.config.js
accent: '#dc2626'   // ← change to any hex
```

### Add a new product
```js
// src/data/products.js
{
  id: '21',
  name: 'Your Product',
  category: 'shirts',   // must match a category id
  price: 4999,
  originalPrice: 6999,  // optional — shows discount badge
  image: 'https://images.unsplash.com/...',
  description: 'Product description',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Black', 'White'],
  inStock: true,
  rating: 4.5,
  reviews: 50,
  featured: true,      // shows on homepage featured section
  newArrival: false,   // shows "New" badge + new arrivals section
}
```

### Add a new category
```js
// src/data/products.js — categories array
{ id: 'suits', label: 'Suits', icon: '🤵', count: products.filter(p => p.category === 'suits').length }
```

---

## 🚢 Deployment

### Frontend → Vercel

```bash
npm run build
# Push to GitHub → connect to Vercel → auto-deploys
# Set env: VITE_API_URL=https://your-backend.railway.app/api
```

### Backend → Railway / Render / Heroku

```bash
cd backend
# Set all env variables in the dashboard
# Start command: node server.js
```

---

## 📦 Payment Methods Supported

| Method       | Status            | Notes                                 |
|--------------|-------------------|---------------------------------------|
| JazzCash     | ✅ Integrated      | HMAC-SHA256 signed, sandbox + prod    |
| EasyPaisa    | 🔧 UI ready       | Add EasyPaisa API in payment.js       |
| Cash on Delivery | ✅ Built-in    | No API needed                         |
| Bank Transfer| ✅ Built-in       | Shows HBL/Meezan account details      |
