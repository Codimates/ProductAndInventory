const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    brandname: {
        type: String,
        required: true,
    },
    brandlogo: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;