const CartDAO = require('../models/CartDAO');
const db = require('../models/db');

class CartService {
    constructor() {
        this.cartDAO = new CartDAO(db);
    }

    async addToCart(userId, productId, variantId, quantity) {
        const cartItem = { userId, productId, variantId, quantity };
        return new Promise((resolve, reject) => {
            this.cartDAO.addToCart(cartItem, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    async getCartByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.cartDAO.getCartByUserId(userId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    async updateCartItem(userId, productId, change) {
        return new Promise((resolve, reject) => {
            this.cartDAO.getCartByUserId(userId, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length === 0) {
                    return reject(new Error('Cart item not found'));
                }
                const currentQuantity = results[0].quantity;
                const newQuantity = currentQuantity + change;
                if (newQuantity <= 0) {
                    this.cartDAO.removeCartItem(userId, productId, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(0);
                    });
                } else {
                    this.cartDAO.updateCartItem(userId, productId, newQuantity, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(newQuantity);
                    });
                }
            });
        });
    }

    async removeCartItem(userId, productId) {
        return new Promise((resolve, reject) => {
            this.cartDAO.removeCartItem(userId, productId, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = CartService;