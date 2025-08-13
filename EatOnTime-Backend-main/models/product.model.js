import mongoose from 'mongoose';
import { Restaurant } from './restaurant.model.js';

const productSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        required: true
    },
    category: [{
        type: String,
        required: true
    }],
    itemType: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        required: true,
        trim: true
    },
    images: {
        mainImage: {
            type: String,
            required: true
        },
        image1: {
            type: String
        },
        image2: {
            type: String
        },
        image3: {
            type: String
        },
        image4: {
            type: String
        }
    },
    availability: {
        type: Boolean,
        default: true,
        trim: true
    },
    estimatedPreparationTime: {
        type: Number,
        default: 30
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isRecommended: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add indexes for common query fields
productSchema.index({ restaurantId: 1 }); // For fetching products by restaurant
productSchema.index({ name: 'text', description: 'text' }); // For text search
productSchema.index({ category: 1 }); // For category filtering
productSchema.index({ price: 1 }); // For price sorting/filtering
productSchema.index({ rating: -1 }); // For sorting by rating
productSchema.index({ isRecommended: 1 }); // For recommended products queries

// Virtual for reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'productId',
    localField: '_id'
});

// Middleware to include virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
