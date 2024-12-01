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

// Create inventory
const createInventory = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image file is required" });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }

    const {
      brand_name,
      model_name,
      stock_level,
      price,
      ram,
      processor,
      graphics_card,
      special_offer
    } = req.body;

    // Validate required fields
    if (!brand_name || !model_name || !stock_level || !price || !ram || !processor || !graphics_card) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Get URLs for all uploaded images
    const imageUrls = req.files.map(file => 
      `https://application-mergx.s3.ap-south-1.amazonaws.com/${file.key}`
    );

    const inventory_id = generateUniqueId();
    const product_id = generateUniqueId();

    const newInventory = new Inventory({
      inventory_id,
      product_id,
      brand_name,
      model_name,
      stock_level: parseInt(stock_level),
      price: parseFloat(price),
      ram,
      processor,
      graphics_card,
      special_offer: special_offer === 'true',
      images: imageUrls,
    });

    const savedInventory = await newInventory.save();
    res.status(201).json({
      message: "Inventory created successfully",
      inventory: savedInventory
    });
  } catch (error) {
    console.error("Error creating inventory:", error);
    res.status(500).json({
      message: "Error creating inventory",
      error: error.message
    });
  }
};

const searchorder = async (req, res) => {
    try {
      // Extract the fields sent in the request body
      const { brand_name, model_name, stock_level, price, ram, processor, graphics_card, special_offer } = req.body;
  
      // Build the query object dynamically
      const query = {};
    if (brand_name) query.brand_name = { $regex: new RegExp(brand_name, 'i') }; // Case-insensitive match
    if (model_name) query.model_name = { $regex: new RegExp(model_name, 'i') }; // Case-insensitive match
    if (stock_level) query.stock_level = parseInt(stock_level);
    if (price) query.price = parseFloat(price);
    if (ram) query.ram = { $regex: new RegExp(ram, 'i') }; // Case-insensitive match
    if (processor) query.processor = { $regex: new RegExp(processor, 'i') }; // Case-insensitive match
    if (graphics_card) query.graphics_card = { $regex: new RegExp(graphics_card, 'i') }; // Case-insensitive match
    if (special_offer) query.special_offer = special_offer;

      // Query the database
      const findInventory = await Inventory.find(query);
  
      // Check if any results were found
      if (findInventory.length === 0) {
        return res.status(404).json({ message: 'No matching inventory found' });
      }
  
      // Return the matching results
      res.status(200).json({ message: 'Matching inventory found', inventory: findInventory });
    } catch (error) {
      // Handle errors and send an appropriate response
      res.status(500).json({ message: 'Error searching inventory', error: error.message });
    }
  };

  //get all inventory
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Error getting inventory", error: error.message });
    }
}

//updaten inventory
const updateInventory = async (req, res) => {
  const { inventory_id } = req.params;
  const { brand_name, model_name, stock_level, price, ram, processor, graphics_card, special_offer } = req.body;
  
  try {
    const inventory = await Inventory.findById(inventory_id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }
    
    const updatedInventory = await Inventory.findByIdAndUpdate(
      inventory_id,  // Use inventory_id instead of inventoryId
      { brand_name, model_name, stock_level, price, ram, processor, graphics_card, special_offer }, 
      { new: true }
    );
    
    res.status(200).json({ message: 'Inventory updated successfully', inventory: updatedInventory });

  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Failed to update inventory. Please try again later.' });
  }
}

//update addsite
const addsite = async (req, res) => {
  const {inventory_id} = req.params;
  const {addsite} = req.body;
  try {
    const inventory = await Inventory.findById(inventory_id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const addsitenow = await Inventory.findByIdAndUpdate(
      inventory_id,
      {addsite},
      {new: true}
    );

    res.status(200).json({ message: 'Site added successfully', inventory: addsitenow });
  } catch (error) {
    console.error('Error updating site:', error);
    res.status(500).json({ error: 'Failed to update site. Please try again later.' });
  }
}

//get inventory addsite is true
const getAddsiteIsTrue = async (req, res) => {
  try {
    const inventory = await Inventory.find({addsite: true});
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error getting inventory", error: error.message });
  }
}

  

module.exports = {
    createInventory,
    searchorder,
    getInventory,
    updateInventory,
    addsite,
    getAddsiteIsTrue
};
