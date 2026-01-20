# E-Commerce API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)
5. [Postman Collection](#postman-collection)

---

## Overview

**Base URL:** `http://localhost:5000/api`

**Authentication:** JWT Bearer Token

**Response Format:** JSON

### Standard Response Structure

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle
- **Expiration:** 7 days (default)
- **Storage:** Client-side (localStorage/sessionStorage)
- **Refresh:** Re-login after expiration

---

## API Endpoints

### 1. Authentication Routes

#### 1.1 Register User
**POST** `/auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890" // Optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, min 6 characters, must contain number
- `phone`: Optional, valid phone format

---

#### 1.2 Login User
**POST** `/auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 1.3 Get Current User
**GET** `/auth/me`

**Auth Required:** Yes

**Description:** Get authenticated user's profile

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "phone": "+1234567890",
      "address": { ... },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

#### 1.4 Update Profile
**PUT** `/auth/profile`

**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+9876543210",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

---

#### 1.5 Update Password
**PUT** `/auth/password`

**Auth Required:** Yes

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

### 2. Product Routes

#### 2.1 Get All Products
**GET** `/products`

**Description:** Get paginated list of products with filtering

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `search` (string): Search in name, description, tags
- `category` (string): Filter by category
- `subcategory` (string): Filter by subcategory
- `brand` (string): Filter by brand
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `minRating` (number): Minimum rating (0-5)
- `featured` (boolean): Featured products only
- `inStock` (boolean): In-stock products only
- `sort` (string): Sort option
  - `price_asc`: Price low to high
  - `price_desc`: Price high to low
  - `rating`: Highest rated
  - `newest`: Newest first
  - `popular`: Most reviews

**Example Request:**
```
GET /products?category=Electronics&minPrice=100&maxPrice=500&sort=rating&page=1
```

**Response (200):**
```json
{
  "success": true,
  "count": 12,
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalPages": 5,
    "totalProducts": 50,
    "hasNext": true,
    "hasPrev": false
  },
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "iPhone 15 Pro",
        "description": "Latest Apple smartphone...",
        "price": 999.99,
        "category": "Electronics",
        "subcategory": "Smartphones",
        "brand": "Apple",
        "stock": 50,
        "images": ["https://example.com/image.jpg"],
        "rating": 4.8,
        "numReviews": 120,
        "featured": true,
        "tags": ["phone", "apple", "premium"],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### 2.2 Get Single Product
**GET** `/products/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "product": { ... }
  }
}
```

---

#### 2.3 Create Product
**POST** `/products`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "subcategory": "Smartphones",
  "brand": "Apple",
  "stock": 50,
  "images": ["https://example.com/image.jpg"],
  "tags": ["phone", "new"],
  "featured": false
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": { ... }
  }
}
```

---

#### 2.4 Update Product
**PUT** `/products/:id`

**Auth Required:** Yes (Admin only)

**Request Body:** (Partial update allowed)
```json
{
  "price": 89.99,
  "stock": 100
}
```

---

#### 2.5 Delete Product
**DELETE** `/products/:id`

**Auth Required:** Yes (Admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {}
}
```

---

#### 2.6 Get Categories
**GET** `/products/categories/list`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      "Electronics",
      "Clothing",
      "Books",
      "Home & Garden",
      "Sports",
      "Toys",
      "Beauty"
    ]
  }
}
```

---

#### 2.7 Get Brands
**GET** `/products/brands/list`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "brands": ["Apple", "Samsung", "Nike", "Sony", ...]
  }
}
```

---

#### 2.8 Get Featured Products
**GET** `/products/featured/list?limit=8`

---

#### 2.9 Get Related Products
**GET** `/products/:id/related?limit=4`

---

### 3. Cart Routes

#### 3.1 Get Cart
**GET** `/cart`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "cart": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439012",
      "items": [
        {
          "product": {
            "_id": "507f1f77bcf86cd799439013",
            "name": "iPhone 15 Pro",
            "price": 999.99,
            "images": ["..."],
            "stock": 50
          },
          "quantity": 2,
          "price": 999.99,
          "_id": "507f1f77bcf86cd799439014"
        }
      ],
      "totalPrice": 1999.98,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  }
}
```

---

#### 3.2 Add to Cart
**POST** `/cart/add`

**Auth Required:** Yes

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart": { ... }
  }
}
```

---

#### 3.3 Update Cart Item
**PUT** `/cart/update`

**Auth Required:** Yes

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 5
}
```

---

#### 3.4 Remove from Cart
**DELETE** `/cart/remove/:productId`

**Auth Required:** Yes

---

#### 3.5 Clear Cart
**DELETE** `/cart/clear`

**Auth Required:** Yes

---

### 4. Order Routes

#### 4.1 Create Order
**POST** `/orders`

**Auth Required:** Yes

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Stripe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439012",
      "orderItems": [ ... ],
      "shippingAddress": { ... },
      "paymentMethod": "Stripe",
      "itemsPrice": 150.00,
      "taxPrice": 15.00,
      "shippingPrice": 0.00,
      "totalPrice": 165.00,
      "isPaid": false,
      "isDelivered": false,
      "status": "Pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Price Calculation:**
- `itemsPrice`: Sum of all products
- `taxPrice`: 10% of items price
- `shippingPrice`: $10 (free if order > $100)
- `totalPrice`: items + tax + shipping

---

#### 4.2 Get My Orders
**GET** `/orders/myorders?page=1&limit=10`

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "totalOrders": 5
  },
  "data": {
    "orders": [ ... ]
  }
}
```

---

#### 4.3 Get Order by ID
**GET** `/orders/:id`

**Auth Required:** Yes

---

#### 4.4 Update Order to Paid
**PUT** `/orders/:id/pay`

**Auth Required:** Yes

**Request Body:**
```json
{
  "id": "pi_stripe_payment_intent_id",
  "status": "succeeded",
  "update_time": "2024-01-01T12:00:00Z",
  "email_address": "customer@example.com"
}
```

---

#### 4.5 Get All Orders (Admin)
**GET** `/orders?page=1&limit=20`

**Auth Required:** Yes (Admin only)

---

#### 4.6 Update Order Status (Admin)
**PUT** `/orders/:id/status`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "status": "Shipped"
}
```

**Valid Statuses:**
- `Pending`
- `Processing`
- `Shipped`
- `Delivered`
- `Cancelled`

---

### 5. Payment Routes

#### 5.1 Get Stripe Config
**GET** `/payment/config`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "publishableKey": "pk_test_xxxxxxxxxxxxx"
  }
}
```

---

#### 5.2 Create Payment Intent
**POST** `/payment/create-intent`

**Auth Required:** Yes

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "orderId": "507f1f77bcf86cd799439011",
    "amount": 165.00
  }
}
```

---

#### 5.3 Confirm Payment
**POST** `/payment/confirm`

**Auth Required:** Yes

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxxxxxxxxxxxx",
  "orderId": "507f1f77bcf86cd799439011"
}
```

---

#### 5.4 Webhook (Stripe)
**POST** `/payment/webhook`

**Auth Required:** No (Stripe signature verification)

**Note:** This endpoint is called by Stripe, not by clients.

---

## Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

### Common Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

**Authorization Error (403):**
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## Postman Collection

### Import Instructions

1. Open Postman
2. Click "Import" button
3. Copy the JSON below
4. Paste and import

### Collection JSON

```json
{
  "info": {
    "name": "E-Commerce API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{base_url}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"phone\": \"+1234567890\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@ecommerce.com\",\n  \"password\": \"admin123\"\n}"
            }
          }
        },
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": "{{base_url}}/auth/me"
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/products?page=1&limit=12"
          }
        },
        {
          "name": "Get Product by ID",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/products/PRODUCT_ID"
          }
        },
        {
          "name": "Create Product (Admin)",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Authorization", "value": "Bearer {{token}}"},
              {"key": "Content-Type", "value": "application/json"}
            ],
            "url": "{{base_url}}/products",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test Product\",\n  \"description\": \"Description\",\n  \"price\": 99.99,\n  \"category\": \"Electronics\",\n  \"brand\": \"TestBrand\",\n  \"stock\": 50\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Cart",
      "item": [
        {
          "name": "Get Cart",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": "{{base_url}}/cart"
          }
        },
        {
          "name": "Add to Cart",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Authorization", "value": "Bearer {{token}}"},
              {"key": "Content-Type", "value": "application/json"}
            ],
            "url": "{{base_url}}/cart/add",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productId\": \"PRODUCT_ID\",\n  \"quantity\": 2\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Orders",
      "item": [
        {
          "name": "Create Order",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Authorization", "value": "Bearer {{token}}"},
              {"key": "Content-Type", "value": "application/json"}
            ],
            "url": "{{base_url}}/orders",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"shippingAddress\": {\n    \"street\": \"123 Main St\",\n    \"city\": \"New York\",\n    \"state\": \"NY\",\n    \"zipCode\": \"10001\",\n    \"country\": \"USA\"\n  }\n}"
            }
          }
        },
        {
          "name": "Get My Orders",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{token}}"}],
            "url": "{{base_url}}/orders/myorders"
          }
        }
      ]
    },
    {
      "name": "Payment",
      "item": [
        {
          "name": "Create Payment Intent",
          "request": {
            "method": "POST",
            "header": [
              {"key": "Authorization", "value": "Bearer {{token}}"},
              {"key": "Content-Type", "value": "application/json"}
            ],
            "url": "{{base_url}}/payment/create-intent",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"orderId\": \"ORDER_ID\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

### Environment Variables

Create an environment in Postman with these variables:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:5000/api` |
| `token` | (Set after login) |

**Auto-save token script:**

Add this to the "Login" request's "Tests" tab:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
}
```

---

## Quick Start Testing Guide

### 1. Register & Login
```bash
# Register
POST /auth/register

# Login (save the token)
POST /auth/login
```

### 2. Browse Products
```bash
# Get all products
GET /products

# Filter electronics
GET /products?category=Electronics

# Search
GET /products?search=iphone
```

### 3. Shopping Flow
```bash
# Add to cart
POST /cart/add

# View cart
GET /cart

# Create order
POST /orders

# Create payment intent
POST /payment/create-intent

# Confirm payment
POST /payment/confirm
```

### 4. Admin Operations
```bash
# Create product
POST /products (admin token required)

# Update order status
PUT /orders/:id/status (admin token required)
```
---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Prices are in USD with 2 decimal places
- Product images are URLs 
- Webhook endpoint uses raw body for signature verification

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**Contact:** miss.laiba.nadeem@gmail.com
