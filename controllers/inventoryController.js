const Inventory = require('../models/inventory');

// In-memory Set to store used IDs
const usedIds = new Set();

// Helper function to generate a unique ID with 3 digits and 1 letter
const generateUniqueId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let uniqueId;
    do {
        const digits = Math.floor(100 + Math.random() * 900); // Generates a random 3-digit number
        const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length)); // Picks a random letter
        uniqueId = `${digits}${randomLetter}`;
    } while (usedIds.has(uniqueId)); // Regenerate if ID has already been used

    // Add the new ID to the set
    usedIds.add(uniqueId);
    return uniqueId;
};

// Post inventory
const createInventory = async (req, res) => {
    try {
        const { brand_name, model_name, stock_level, price, description } = req.body;

        // Generate unique IDs for inventory_id and product_id
        const inventory_id = generateUniqueId();
        const product_id = generateUniqueId();

        // Create a new inventory document with description fields
        const newInventory = new Inventory({
            inventory_id,
            product_id,
            brand_name,
            model_name,
            stock_level,
            price,
            description: {
                ram: description.ram,
                processor: description.processor,
                graphics_card: description.graphics_card,
                special_offer: description.special_offer || null
            },
            addsite: false
        });

        // Save the document to the database
        const savedInventory = await newInventory.save();
        res.status(201).json({ message: 'Inventory created successfully', inventory: savedInventory });
    } catch (error) {
        res.status(500).json({ message: 'Error creating inventory', error: error.message });
    }
};

module.exports = {
    createInventory
};
