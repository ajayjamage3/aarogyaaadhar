import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // optional reference to the customer
        required: false,
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    favoriteFlavor: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Number,
        default: 1,
    },
});

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);