// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import CartItemController from './cart.controller.js';

// 2. Initialize Express router.
const cartRouter = express.Router();


const cartItemController = new CartItemController;

cartRouter.post('/', (req, res, next) => {
    cartItemController.add(req, res, next)
});
cartRouter.get('/', (req, res, next) => {
    cartItemController.get(req, res, next)
});
cartRouter.delete('/:id', (req, res, next) => {
    cartItemController.delete(req, res, next)
})

export default cartRouter;
