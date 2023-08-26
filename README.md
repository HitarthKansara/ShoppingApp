# ShoppingApp
---

# Node.js Application: E-Commerce Platform

An E-Commerce platform developed using Node.js, Express.js, MongoDB, and JWT authentication.

## Features

- User registration through a unique mobile number.
- Role-based login system: Admin and User roles.
  - Admin: Full access with static admin entry in the database.
  - User: Self-write access.
- User can place orders for products after logging in.
- Admin can upload multiple product images with image validation (size and type: .jpg and .png).
- JWT token-based authentication for secure user sessions.
- CRUD operations for products:
  - Product Name, Size, Image, Colour, Price, Quantity.
- CRUD operations for user-specific orders:
  - user_id, order_code, order_date, required_date, shipped_date, order_status.
- Sorting, pagination, and search by Name of Product.
  - Initial page displays 10 records, followed by 12 records each.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/HitarthKansara/ShoppingApp.git
   cd your-repo
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory and add the following variables:

   PORT=5001

   JWT_AUTH_SECRET='I love India'

   JWT_REFRESH_SECRET='I am admin'

   MONGODB_URI='mongodb://127.0.0.1:27017/shoppingApp'

   ACCOUNTSID='Your twilio sid'

   AUTHTOKEN='Your twilio auth otken'
   

4. **Run the Application:**

   ```bash
   npm start
   ```

   The server will start on port 5001 by default. You can access the application at http://localhost:5001.

## API Endpoints

- **User Signup:**
  - CRUD operations on `/user` endpoint
  
- **Products:**
  - CRUD operations on `/product` endpoint

- **User Orders:**
  - CRUD operations on `/order` endpoint

- **Admin Functionality:**
  - Manage products and orders of all users
