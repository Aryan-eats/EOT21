import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Product } from './product.model.js';

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: [true, 'Street address is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    state: {
        type: String,
        required: [true, 'State is required']
    },
    zipCode: {
        type: String,
        required: [true, 'Postal/Zip code is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    }
});

// Add 2dsphere index to coordinates for geospatial queries
addressSchema.index({ coordinates: '2dsphere' });

const openingHoursSchema = new mongoose.Schema({
    open: {
        type: String,
        required: [true, 'Opening time is required']
    },
    close: {
        type: String,
        required: [true, 'Closing time is required']
    }
});

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Restaurant name is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't include password in query results by default
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true
    },
    address: addressSchema,
    cuisineType: {
        type: String,
        required: [true, 'Cuisine type is required']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    images: {
        logo: String,
        cover: String,
        gallery: [String]
    },
    openingHours: {
        type: Map,
        of: openingHoursSchema,
        default: {}
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    avgPrepTime: {
        type: Number,
        default: 30 // in minutes
    },
    minOrderAmount: {
        type: Number,
        default: 0
    },
    deliveryFee: {
        type: Number,
        default: 0
    },
    taxPercentage: {
        type: Number,
        default: 0
    },
    tags: [String],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    passwordChangedAt: Date
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add indexes for common query fields
restaurantSchema.index({ name: 'text', cuisineType: 'text', 'address.city': 'text' });
restaurantSchema.index({ cuisineType: 1 });
restaurantSchema.index({ isOpen: 1, isActive: 1 });
restaurantSchema.index({ rating: -1 });

// Virtual field for orders
restaurantSchema.virtual('orders', {
    ref: 'Order',
    foreignField: 'restaurantId',
    localField: '_id'
});

// Hash password before saving
restaurantSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update passwordChangedAt field when password is changed
restaurantSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    
    // Set passwordChangedAt to current time minus 1 second
    // This ensures the token is created after the password has been changed
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Method to check if password is correct
restaurantSchema.methods.isPasswordCorrect = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after a token was issued
restaurantSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    
    // False means NOT changed
    return false;
};

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);