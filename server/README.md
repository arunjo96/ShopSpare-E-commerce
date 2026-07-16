# 🛒 ShopSphere Backend

A scalable RESTful API for an Amazon-like E-Commerce application built with the MERN Stack. It provides secure authentication, product management, shopping cart, wishlist, order management, image uploads, and Razorpay payment integration.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Redis
- Cloudinary
- Multer
- Razorpay (Test Mode)
- Nodemailer
- bcrypt

---

# ✨ Features

## 🔐 Authentication

- User Registration
- Email Verification
- User Login
- User Logout
- Forgot Password
- Reset Password
- Refresh Token
- JWT Authentication
- Role-Based Authorization (Admin/User)

---

# 📁 Project Structure

```
server/
│
├── src/
│   │
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── Db.js
│   │   ├── mail.js
│   │   ├── razorpay.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── brandController.js
│   │   │   ├── categoryController.js
│   │   │   ├── orderController.js
│   │   │   └── productController.js
│   │   ├── authController.js
│   │   ├── brandController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   └── wishlistController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── rateMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Brand.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── brandRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   └── wishlistRoutes.js
│   │
│   ├── templates/
│   │   ├── resetPasswordMail.js
│   │   └── welcomeMail.js
│   │
│   ├── utils/
|   |   ├── cloudinaryUpload.js
│   │
│   |
│   ├──
│
├── index.js
├── .env
├── package.json
└── README.md
```

---


# 📥 Installation

### Clone Repository

```bash
git clone https://github.com/arunjo96/shopSpare-E-commerce.git
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```
---

# 📚 API Modules

- Authentication
- Categories
- Brands
- Products
- Cart
- Wishlist
- Orders
- Payments

---


# 👨‍💻 Author

**Arunkumar V**

Full Stack MERN Developer

- MERN Stack
- REST APIs
- MongoDB
- Express.js
- React.js
- Node.js