import OrderRepository from "./order.repository.js";


export default class OrderController{
    constructor() {
        this.orderRepository = new OrderRepository
    };

    async placeOrder(req, res, next) {
        try {
            const userID = req.userID;
            const result = await this.orderRepository.placeOrder(userID);
            res.status(201).send("order is created");
        } catch (err) {
            next(err)
        }
    }
}