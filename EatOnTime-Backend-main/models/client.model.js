import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
    label: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
    },
    default: {
        type: Boolean,
        default: false
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

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email is required'],
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Phone number is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't include password in query results by default
    },
    addresses: [addressSchema],
    profileImage: {
        type: String,
        default: ''
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    passwordChangedAt: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add indexes for common query fields
clientSchema.index({ email: 1 });
clientSchema.index({ phone: 1 });
clientSchema.index({ name: 'text' });

// Virtual field for orders
clientSchema.virtual('orders', {
    ref: 'Order',
    foreignField: 'clientId',
    localField: '_id'
});

// Query middleware to filter out inactive users
clientSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

// Hash password before saving
clientSchema.pre('save', async function(next) {
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
clientSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    
    // Set passwordChangedAt to current time minus 1 second
    // This ensures the token is created after the password has been changed
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Method to check if password is correct
clientSchema.methods.isPasswordCorrect = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after a token was issued
clientSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    
    // False means NOT changed
    return false;
};

export const Client = mongoose.model('Client', clientSchema);