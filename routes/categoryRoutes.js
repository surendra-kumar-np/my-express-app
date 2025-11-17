const express = require('express');
const { getAll, create } = require('../controllers/categoryController');
const router = express.Router();

router.get('/', getAll);
router.post('/', create);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
// const { protect, admin } = require('../middleware/authMiddleware');

// router.get('/', getCategories);
// router.get('/:id', getCategory);
// router.post('/', protect, admin, createCategory);
// router.put('/:id', protect, admin, updateCategory);
// router.delete('/:id', protect, admin, deleteCategory);

// module.exports = router;
