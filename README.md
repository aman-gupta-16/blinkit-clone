# 🛒 Blinkit Clone — Full-Stack Grocery Delivery App

A full-stack Blinkit-inspired grocery delivery application built with React + Vite + Tailwind CSS (frontend) and Node.js + Express + MongoDB (backend).

---

## 📁 Project Structure

```
blinkit-clone/
├── client/                   # React + Vite + Tailwind CSS frontend
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── context/          # Auth & Cart React contexts
│       ├── pages/            # Route-level page components
│       └── services/         # Axios API service layer
│
├── server/                   # Node.js + Express backend
│   ├── config/               # MongoDB connection
│   ├── constants/            # HTTP status codes & messages
│   ├── controllers/          # Request/response handlers
│   ├── middleware/           # Auth, admin, error middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express route definitions
│   ├── seed/                 # Database seed scripts
│   ├── services/             # Business logic layer
│   └── utils/                # Helpers (asyncHandler, generateToken)
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Backend Setup

```bash
cd server
npm install
# Copy and configure environment variables:
# PORT=5000, MONGO_URI=mongodb://localhost:27017/blinkit-clone, JWT_SECRET=your_secret
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**  
Backend API runs at: **http://localhost:5000**

### 3. Seed Database

```bash
# Create admin user
cd server
node seed/createAdmin.js

# Seed products (~30 grocery items)
node seed/seedProducts.js
```

---

## 🔐 Auth & Role System

JWT-based authentication. Token is stored in `localStorage` and attached via `Authorization: Bearer <token>` header.

| Role  | Permissions |
|-------|-------------|
| `user` | Browse products, manage own cart, place orders, view order history |
| `admin` | All user permissions + create/edit/delete products + manage orders |

**Admin credentials (after seeding):**
- Email: `admin@blinkit.com`
- Password: `admin123`

---

## 📦 API Documentation

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Private | Get current user |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List all products (supports `?search=`, `?category=`, `?page=`, `?limit=`) |
| GET | `/api/products/categories` | Public | Get all categories |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Cart (all protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart` | Add item `{ productId, quantity }` |
| PUT | `/api/cart/:id` | Update item quantity |
| DELETE | `/api/cart/:id` | Remove item |

### Orders (all protected)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | User | Place a new order |
| GET | `/api/orders` | User | Get current user's past & active orders |
| GET | `/api/orders/:orderId` | User | Get detailed information for a specific order |
| GET | `/api/orders/admin/all` | Admin | Get all orders from across the platform |

---

## 🌱 Admin Seed Script

```bash
cd server
node seed/createAdmin.js
# Creates: admin@blinkit.com / admin123

node seed/seedProducts.js
# Seeds 30 grocery products across 8 categories
```

---

## 🏗️ Architecture

The backend follows a strict **layered architecture**:

- **Routes** → declare endpoints and apply middleware
- **Controllers** → handle req/res, delegate to services
- **Services** → contain all business logic
- **Models** → Mongoose schemas and database interaction

All async errors are caught by `asyncHandler` and forwarded to the centralized `errorMiddleware`.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| State | React Context API |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Notifications | React Hot Toast |
| Icons | Lucide React |
