const { Order, OrderItem } = require('../models/Order');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
    const { items } = req.body; // [{ product_id, quantity }]
    try {
        if (!items || items.length === 0)
            return res.status(400).json({ message: 'No items in order' });

        // Calculate total
        let total = 0;
        for (const item of items) {
            const product = await Product.findByPk(item.product_id);
            if (!product) return res.status(404).json({ message: `Product ${item.product_id} not found` });
            total += product.price * item.quantity;
        }

        const order = await Order.create({ user_id: req.user.id, total_price: total });
        for (const item of items) {
            const product = await Product.findByPk(item.product_id);
            await OrderItem.create({
                order_id: order.id,
                product_id: product.id,
                quantity: item.quantity,
                price: product.price,
            });
        }

        res.json({ message: 'Order placed successfully', order_id: order.id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyOrders = async (req, res) => {
    const orders = await Order.findAll({ where: { user_id: req.user.id }, include: OrderItem });
    res.json(orders);
};

exports.getAllOrders = async (req, res) => {
    const orders = await Order.findAll({ include: OrderItem });
    res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
};

exports.deleteOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await order.destroy();
    res.json({ message: 'Order cancelled' });
};
