// 1. Import express
import "./env.js"
import express from 'express';
import swagger from "swagger-ui-express";
import cors from "cors";
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cart/cart.routes.js';
import apiDocs from "./swagger.json" assert { type: 'json' }
import loggerMiddleware from './src/middlewares/log.midleware.js';
import { appendFileLevelError } from './src/Error Handler/appendFileLevelError.js'
import { connectToMongoDB } from './src/config/mongodb.js';
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongoose.config.js";
import likeRouter from "./src/features/likes/like.routes.js";

// 2. Create Server
const server = express();

// CORS policy configuration.
const corsOptions = {
    origin: 'http://localhost:5500'
}

server.use(cors(corsOptions));

// Apply JSON parsing middleware before loggerMiddleware
server.use(express.json());

// Apply loggerMiddleware after body parsing
server.use(loggerMiddleware);

// Route handlers
server.use("/api/products", jwtAuth, productRouter);
server.use('/api/users', userRouter);
server.use('/api/cartItems', jwtAuth, cartRouter);
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));
server.use('/api/order', jwtAuth, orderRouter);
server.use('/api/likes', jwtAuth,  likeRouter)

// 3. Default request handler
server.get('/', (req, res) => {
    res.send("Welcome to Ecommerce APIs");
});

// 4. midleware to handle the application level error.
server.use(appendFileLevelError)

// 5. Middleware to handle 404 requests
server.use((req, res) => {
    res.status(404).send("API not found. Please check our documentation for more information at localhost:3200/api-docs");
});


// 5. Specify port
server.listen(process.env.PORT, () => {
    console.log("Server is running at 3200");
    // connectToMongoDB();
    connectUsingMongoose();
});
