// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import connectDB from "./src/config/Db.js";
// import http from "http";
// import errorHandler from "./src/middleware/errorHandler.js";
// import redisClient from "./src/config/redis.js";

// connectDB();

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// const PORT = process.env.PORT || 7000;

// const server = http.createServer(app);

// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "MERN Auth API is running",
//   });
// });

// app.use(errorHandler);

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import connectDB from "./src/config/Db.js";
import redis from "./src/config/redis.js";
import errorHandler from "./src/middleware/errorHandler.js";

import authRouter from "./src/routes/authRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import categoryRouter from "./src/routes/categoryRoutes.js";
import brandRouter from "./src/routes/brandRoutes.js";
import cartRouter from "./src/routes/cartRoutes.js";
import wishlistRouter from "./src/routes/wishlistRoutes.js";
import orderRouter from "./src/routes/orderRoutes.js";
import paymentRouter from "./src/routes/paymentRoutes.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 7000;

const startServer = async () => {
  try {
    await connectDB();
  

    app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
      }),
    );

    app.use(helmet());

    app.use(compression());

    app.use(morgan("dev"));

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser());

 
    app.get("/", (req, res) => {
      res.status(200).json({
        status: "success",
        message: "🚀 MERN E-Commerce API is running...",
      });
    });

    // ==========================
    // API Routes
    // ==========================

    app.use("/api/auth", authRouter);

    app.use("/api/products", productRouter);

    app.use("/api/categories", categoryRouter);

    app.use("/api/brands", brandRouter);

    app.use("/api/cart", cartRouter);

    app.use("/api/wishlist", wishlistRouter);

    app.use("/api/orders", orderRouter);

    app.use("/api/payment", paymentRouter);




    // app.use("/api/cart", cartRoutes);
    // app.use("/api/orders", orderRoutes);

    // ==========================
   
    app.use(errorHandler);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Startup Failed:", error);
    process.exit(1);
  }
};

startServer();