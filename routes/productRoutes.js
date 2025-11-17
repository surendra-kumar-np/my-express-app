const express = require('express');
const upload = require('../utils/fileUpload');
const { getAll, create } = require('../controllers/productController');
const router = express.Router();

router.get('/', getAll);
router.post('/', upload.single('image'), create);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
// const { protect, admin } = require('../middleware/authMiddleware');
// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) { cb(null, 'uploads/'); },
//     filename: function(req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
// });
// const upload = multer({ storage });

// router.get('/', getProducts);
// router.get('/:id', getProduct);
// router.post('/', protect, admin, upload.single('image'), createProduct);
// router.put('/:id', protect, admin, updateProduct);
// router.delete('/:id', protect, admin, deleteProduct);

// module.exports = router;
