# SimpleFinds - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce web application built with the MERN stack, featuring secure payment processing, real-time cart management, and an intuitive admin dashboard.

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payment-blueviolet)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)

> Developed as part of SkilledScore Software Engineering Internship Program

## Features

### Customer Features
- **JWT Authentication** - Secure user registration and login
- **Product Catalog** - Browse 50+ products across 8 categories
- **Advanced Filtering** - Search, category, price range, and rating filters
- **Shopping Cart** - Real-time cart management with quantity controls
- **Stripe Integration** - Secure payment processing
- **Order Management** - Track order history and status
- **User Profile** - Update personal information and password

### Admin Features
- **Dashboard Analytics** - Revenue, orders, and product statistics
- **Order Management** - Update order status in real-time
- **Product Management** - CRUD operations for products (API ready)

### Technical Highlights
- **Performance** - Optimized with pagination, lazy loading
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Security** - Bcrypt password hashing, JWT tokens, input validation
- **Testing** - 28 unit tests with >80% code coverage
- **UI/UX** - Modern, intuitive interface with smooth animations

---

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Stripe account (test mode)

### Installation
```bash
# Clone repository
git clone https://github.com/laibulous/ECommerce-Store.git
cd ECommerce-Store

# Backend setup
cd backend
npm install
cp .env.example .env
# Configure .env with your MongoDB URI, JWT secret, and Stripe keys

# Seed database
npm run seed

# Start backend server
npm run dev

# Frontend setup (new terminal)
cd ../frontend
npm install
cp .env.example .env
# Add your Stripe publishable key

# Start frontend
npm run dev
```

### Environment Variables

**Backend (`backend/.env`):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## Testing
```bash
cd backend
npm test                 # Run all tests
npm run test:watch      # Watch mode
```

**Test Coverage:** >80% (28 unit tests covering authentication, products, cart)

**Test Credentials:**
- Admin: `admin@ecommerce.com` / `admin123`
- Customer: `john@example.com` / `password123`

**Stripe Test Card:** `4242 4242 4242 4242` (any future date, any CVC)

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| PUT | `/auth/profile` | Update profile | ✅ |
| PUT | `/auth/password` | Change password | ✅ |

### Product Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Get all products (paginated) | ❌ |
| GET | `/products/:id` | Get single product | ❌ |
| POST | `/products` | Create product | ✅ Admin |
| PUT | `/products/:id` | Update product | ✅ Admin |
| DELETE | `/products/:id` | Delete product | ✅ Admin |

### Cart Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | Get user cart | ✅ |
| POST | `/cart/add` | Add item to cart | ✅ |
| PUT | `/cart/update` | Update cart item | ✅ |
| DELETE | `/cart/remove/:id` | Remove from cart | ✅ |

### Order Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Create order | ✅ |
| GET | `/orders/myorders` | Get user orders | ✅ |
| GET | `/orders/:id` | Get order details | ✅ |
| GET | `/orders` | Get all orders | ✅ Admin |
| PUT | `/orders/:id/status` | Update order status | ✅ Admin |

**Full API documentation:** See `backend/docs/API_DOCUMENTATION.md`

---

## Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite
- React Router v6
- Tailwind CSS
- Axios
- Stripe.js
- Lucide React (icons)

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt (password hashing)
- Stripe API
- Express Validator

**Testing:**
- Jest
- Supertest
- MongoDB Memory Server

### Database Schema

**Users**
```
- name, email, password (hashed)
- role (customer/admin)
- phone, address
```

**Products**
```
- name, description, price
- category, brand, stock
- images[], rating, numReviews
```

**Carts**
```
- user (ref), items[]
- totalPrice
```

**Orders**
```
- user (ref), orderItems[]
- shippingAddress, paymentMethod
- prices (items, tax, shipping, total)
- status, isPaid, isDelivered
```

---

## Project Structure
```
ECommerce-Store/
├── backend/
│   ├── config/         # DB, Stripe config
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth, validation, errors
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── tests/          # Unit tests
│   └── server.js       # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth & Cart context
    │   ├── pages/      # Page components
    │   ├── services/   # API calls
    │   └── utils/      # Helpers
    └── public/
```

---

## Known Limitations

- Image upload not implemented (uses placeholder URLs)
- Product reviews system pending
- Email notifications not configured
- Wishlist feature UI only (backend pending)

---

## Future Enhancements

- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications (order confirmations)
- [ ] Real-time order tracking
- [ ] Image upload (Cloudinary)
- [ ] Advanced admin analytics
- [ ] Multi-currency support
- [ ] Social authentication (Google, GitHub)

---

## Contributing

This project was developed as part of an internship assignment. Feel free to fork and enhance!

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Developer

**Laiba Nadeem**  
Email: [miss.laiba.nadeem@gmail.com](miss.laiba.nadeem@gmail.com)  
LinkedIn: [https://www.linkedin.com/in/laiba-nadeem-blyke/](https://www.linkedin.com/in/laiba-nadeem-blyke/)  

**Organization:** SkilledScore - Software Engineering Internship Program

---

## Acknowledgments

- SkilledScore for the internship opportunity
- Stripe for payment processing
- MongoDB Atlas for database hosting
- The open-source community

---

**If you found this project helpful, please give it a star!**
