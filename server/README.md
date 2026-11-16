# ShopHub

Advanced E-commerce and Inventory Management System.
ShopHub — Ecommerce Platform

A full-stack ecommerce application built with React, Vite, Node.js, Express, and MongoDB.

Technologies

React and Vite

Node.js and Express

MongoDB and Mongoose

JWT Authentication

CSS

# Features

User registration and login

Product browsing

Shopping cart

Favorites

Checkout and orders

Admin dashboard

Product management

Contact messages
# ShopHub E-Commerce 🛒
A modern, full-stack e-commerce web application featuring a responsive React frontend, a secure Node.js/Express backend, and a cloud-hosted MongoDB database.

🚀 Live Deployment
Frontend (Vercel): https://shop-hub-ecommerce-three.vercel.app

Backend API (Render): https://shophub-ecommerce-3ad9.onrender.com

(Note: The backend is hosted on Render's free tier and may take 30-50 seconds to spin up on the first request).

# ✨ Features
User Authentication (JWT)

Browse and search products

Shopping cart management

Responsive and modern UI

Fully RESTful API


# 🔌 API Route Documentation
Authentication
POST /api/auth/register - Register a new user

POST /api/auth/login - Authenticate user & get token

Products
GET /api/products - Fetch all products

GET /api/products/:id - Fetch a single product by ID

POST /api/products - Create a new product (Admin only)

Cart & Orders
GET /api/cart - Retrieve current cart items

POST /api/cart - Add item to cart

POST /api/orders - Create a new order

# 🛠️ Tech Stack
Frontend: React, Vite, Axios, React Router, CSS

Backend: Node.js, Express.js, JSON Web Tokens (JWT)

Database: MongoDB Atlas (Mongoose)

Deployment: Vercel (Client) & Render (Server)

# 💻 Local Installation
Clone the repository:

bash
git clone https://github.com/atinafu11-hue/ShopHub-Ecommerce.git
cd ShopHub-Ecommerce
Setup Backend:

bash
cd server
npm install
# Create a .env file and add MONGODB_URI, JWT_SECRET, PORT
npm run dev
Setup Frontend:

bash
cd ../client
npm install
# Create a .env file and add VITE_API_URL=http://localhost:3000/api
npm run dev