import CartItemsModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export default class CartItemController {

    constructor() {
        this.cartRepository = new CartRepository();
    }

    async add(req, res, next) {
        try {
            const { productID, quantity } = req.body;
            const userID = req.userID;
            console.log(`Adding item to cart - userID: ${userID}, productID: ${productID}, quantity: ${quantity}`);
            const cart = await this.cartRepository.add(productID, userID, quantity);
            console.log(`contoller cart: ${cart}`);
            res.status(201).send("Cart is updated");
        } catch (err) {
            next(err)
        }
    }

    async get(req, res, next) {
        try {
            const userID = req.userID;
            console.log(`Fetching cart items for userID: ${userID}`);
            const items = await this.cartRepository.get(userID);
            // console.log(items)
            return res.status(200).send(items);
        } catch(err) {
            next(err)
        }
    }

    async delete(req, res, next) {
        const userID = req.userID;
        const cartItemID = req.params.id;
        const isDeleted = await this.cartRepository.delete(cartItemID, userID);
        if (!isDeleted) {
            return res.status(404).send("Item not found");
        };
        return res.status(200).send("Cart Item Is removed")
    }
}
