import express from 'express';

import {
	createOrder,
	getOrders,
	getOrderById,
	updateOrderStatus,
	assignRider,
	deleteOrder
} from '../controllers/order.controller.js';
// import authorize from '../middleware/auth.middleware.js'; // Uncomment and use as needed

const router = express.Router();

// Create order
router.post('/', /* authorize, */ createOrder);

// Get all orders       (ADD pagination/filtering)
router.get('/', getOrders);

// Get order by ID
router.get('/:orderId', getOrderById);

// Update order
router.put('/:orderId/status', updateOrderStatus);

// Assign rider
router.put('/:orderId/assign', /* authorize, */ assignRider);

// Cancel/delete order
router.delete('/:orderId', /* authorize, */ deleteOrder);

export default router;
