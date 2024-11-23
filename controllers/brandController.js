const Brand = require('../models/brand');

//post brand
const createBrand = async (req, res) => {
    try {
        const { brandname, brandlogo } = req.body;
        const newBrand = new Brand({
            brandname,
            brandlogo,
        });
        const savedBrand = await newBrand.save();
        res.status(201).json({ message: "Brand created successfully", brand: savedBrand });
    } catch (error) {
        res.status(500).json({ message: "Error creating brand", error: error.message });
    }
};

module.exports = {
    createBrand

}