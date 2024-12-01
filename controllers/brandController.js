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

//get all brands
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: "Error getting brands", error: error.message });
    }
};

//delete
const deleteBrand = async (req,res) =>{
    const brandId = req.params.brandId;
    try {
        const brand = await Brand.findById(brandId);

        if (!brand){
            return res.status(400).json({ error: 'Brand not found'})
        }
        //delete the Brand
        await Brand.findByIdAndDelete(brandId);

        res.status(200).json({ message: 'Brand deleted successfully'})
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete brand. Please try again later.' });
    }
}

// Update a brand
const updateBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const { brandname, brandlogo } = req.body;

        // Check if the brand exists
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(400).json({ error: 'Brand not found' });
        }

        // Update the brand
        const updatedBrand = await Brand.findByIdAndUpdate(
            brandId,
            { brandname, brandlogo },
            { new: true } // Return the updated brand
        );

        res.status(200).json({ message: 'Brand updated successfully', brand: updatedBrand });
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({ error: 'Failed to update brand. Please try again later.' });
    }
};

module.exports = {
    createBrand,
    getBrands,
    deleteBrand,
    updateBrand

}