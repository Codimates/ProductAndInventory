const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    inventory_id: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    brand_name: {
      type: String,
      required: true,
    },
    model_name: {
      type: String,
      required: true,
    },
    stock_level: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ram: {
      type: String,
      required: true,
    },
    processor: {
      type: String,
      required: true,
    },
    graphics_card: {
      type: String,
      required: true,
    },
    special_offer: {
      type: String,
      default: null, // Optional field, can have a default value if no offer is available
    },
    addsite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
