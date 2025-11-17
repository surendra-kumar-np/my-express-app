const express = require('express');
const { getAll, create } = require('../controllers/orderController');
const router = express.Router();

router.get('/', getAll);
router.post('/', create);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
// const { protect, admin } = require('../middleware/authMiddleware');

// router.post('/', protect, placeOrder);          // User places order
// router.get('/my', protect, getMyOrders);        // User's orders
// router.get('/', protect, admin, getAllOrders);  // Admin: all orders
// router.put('/:id', protect, admin, updateOrderStatus);
// router.delete('/:id', protect, deleteOrder);

// module.exports = router;
