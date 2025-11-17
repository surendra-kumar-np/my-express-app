const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
    const products = await Product.findAll({ include: Category });
    res.json(products);
};

exports.getProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id, { include: Category });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
};

exports.createProduct = async (req, res) => {
    const { name, description, price, stock, category_id } = req.body;
    const image = req.file ? req.file.filename : null;
    const product = await Product.create({ name, description, price, stock, category_id, image });
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json(product);
};

exports.deleteProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
};
