const CartService = require('../services/cartService');
const UserService = require('../services/userService');
const cartService = new CartService();
const userService = new UserService();

exports.addToCart = async (req, res) => {
    try {
        const { account, product_id, variant_id, quantity } = req.body;
        const user = await userService.getUserByAccount(account);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        await cartService.addToCart(user.id, product_id, variant_id, quantity);
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Error adding to cart' });
    }
};

exports.getCart = async (req, res) => {
    try {
        const account = req.query.account;
        const user = await userService.getUserByAccount(account);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const cartItems = await cartService.getCartByUserId(user.id);
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Error fetching cart items' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { account, product_id, change } = req.body;
        const user = await userService.getUserByAccount(account);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const newQuantity = await cartService.updateCartItem(user.id, product_id, change);
        res.json({ success: true, newQuantity });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ error: 'Error updating cart item' });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { account, product_id } = req.body;
        const user = await userService.getUserByAccount(account);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        await cartService.removeCartItem(user.id, product_id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({ error: 'Error removing cart item' });
    }
};