import mongoose from 'mongoose';

const orderStatusEnum = [
	'pending',       
	'confirmed',      
	'preparing',      
	'ready',          
	'picked_up',      
	'delivered',      
	'cancelled'       
];

const paymentStatusEnum = [
	'pending', 'paid', 'failed', 'refunded'
];

const paymentMethodEnum = [
	'cash', 'online'
];

const orderItemSchema = new mongoose.Schema({
	productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true },
	quantity: { type: Number, required: true },
	subtotal: { type: Number, required: true },
	image: { type: String },
    notes: { type: String }
}, { _id: false });

const addressSchema = new mongoose.Schema({
	street: String,
	city: String,
	state: String,
	postalCode: String,
	country: String,
	coordinates: {
		type: { type: String, enum: ['Point'], default: 'Point' },
		coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
	}
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
	status: { type: String, enum: orderStatusEnum, required: true },
	timestamp: { type: Date, default: Date.now },
	updatedBy: { type: String, enum: ['system', 'customer', 'restaurant', 'rider', 'admin'], default: 'system' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
	customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
	restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
	riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },

	items: { type: [orderItemSchema], required: true },

	deliveryAddress: { type: addressSchema, required: true },

	status: { type: String, enum: orderStatusEnum, default: 'pending', required: true },
	statusHistory: { type: [statusHistorySchema], default: [] },

	pricing: {
		subtotal: { type: Number, required: true },
		deliveryFee: { type: Number, required: true },
		tax: { type: Number, default: 0.05 },
		discount: { type: Number, default: 0 },
        tip: { type: Number, default: 0 },
        serviceFee: { type: Number, default: 0 },
		total: { type: Number, required: true }
	},

	payment: {
		status: { type: String, enum: paymentStatusEnum, default: 'pending' },
		method: { type: String, enum: paymentMethodEnum },
		transactionId: { type: String },
		paidAt: { type: Date }
	},

	estimatedDeliveryTime: { type: Date },
	deliveredAt: { type: Date },
	cancelledAt: { type: Date },
	cancellationReason: { type: String },

	notes: { type: String },
	meta: { type: mongoose.Schema.Types.Mixed },

}, { timestamps: true });

orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });
orderSchema.index({ customerId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ riderId: 1 });
orderSchema.index({ status: 1 });

export const Order = mongoose.model('Order', orderSchema);
