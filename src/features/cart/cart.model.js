export default class CartItemsModel {
    constructor(productID, userID, quantity, id) {
        this.productID = parseInt(productID); // Ensure productID is an integer
        this.userID = parseInt(userID); // Ensure userID is an integer
        this.quantity = parseInt(quantity); // Ensure quantity is an integer
        this.id = id;
    }

    static add(productID, userID, quantity) {
        productID = parseInt(productID); // Ensure productID is an integer
        userID = parseInt(userID); // Ensure userID is an integer
        quantity = parseInt(quantity); // Ensure quantity is an integer

        // Find if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(
            (item) => item.productID === productID && item.userID === userID
        );

        if (existingItemIndex >= 0) {
            // If the item exists, update its quantity
            cartItems[existingItemIndex].quantity += quantity;
            return cartItems[existingItemIndex];
        } else {
            // If the item does not exist, create a new cart item
            const newCartItem = new CartItemsModel(productID, userID, quantity, cartItems.length + 1);
            cartItems.push(newCartItem);
            return newCartItem;
        }
    }

    static get(userID) {
        userID = parseInt(userID); // Ensure userID is an integer
        return cartItems.filter((item) => item.userID === userID);
    }

    static removeCartItem(userID, productID) {
        userID = parseInt(userID); // Ensure userID is an integer
        productID = parseInt(productID); // Ensure productID is an integer

        // Find item in the cart
        const itemIndex = cartItems.findIndex((i) => i.productID === productID && i.userID === userID);

        if (itemIndex >= 0) {
            // Remove the item from cart
            const removedItem = cartItems.splice(itemIndex, 1);
            return removedItem[0];
        } else {
            throw new Error("Item not found in the cart");
        }
    }
}

const cartItems = [
    new CartItemsModel(1, 2, 1, 1),
    new CartItemsModel(1, 1, 2, 2)
];
