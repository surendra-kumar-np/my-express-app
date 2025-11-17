const Category = require('../models/Category');

exports.getAll = async (req, res) => {
  const categories = await Category.findAll();
  res.json(categories);
};

exports.create = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// const Category = require('../models/Category');

// exports.getCategories = async (req, res) => {
//     const categories = await Category.findAll();
//     res.json(categories);
// };

// exports.getCategory = async (req, res) => {
//     const category = await Category.findByPk(req.params.id);
//     if (!category) return res.status(404).json({ message: 'Category not found' });
//     res.json(category);
// };

// exports.createCategory = async (req, res) => {
//     const { name, description } = req.body;
//     const category = await Category.create({ name, description });
//     res.json(category);
// };

// exports.updateCategory = async (req, res) => {
//     const category = await Category.findByPk(req.params.id);
//     if (!category) return res.status(404).json({ message: 'Category not found' });
//     await category.update(req.body);
//     res.json(category);
// };

// exports.deleteCategory = async (req, res) => {
//     const category = await Category.findByPk(req.params.id);
//     if (!category) return res.status(404).json({ message: 'Category not found' });
//     await category.destroy();
//     res.json({ message: 'Category deleted' });
// };
