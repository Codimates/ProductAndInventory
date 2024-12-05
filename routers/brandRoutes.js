const express = require('express');
const router = express.Router();
const cors = require('cors');


// Updated CORS configuration
router.use(
    cors()
);

const { createBrand, getBrands, deleteBrand, updateBrand } = require('../controllers/brandController')

router.post('/create', createBrand)
router.get('/getallbrands', getBrands)
router.delete('/deletebrand/:brandId', deleteBrand)
router.put('/updatebrand/:brandId', updateBrand)


module.exports = router;