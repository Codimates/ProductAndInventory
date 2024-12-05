const express = require('express');
const router = express.Router();
const cors = require('cors');
const upload = require('../helpers/upload');

// Updated CORS configuration
router.use(
    cors()
);

const { createInventory,searchorder, getInventory } = require('../controllers/inventoryController');


router.post('/create', upload.array('images',3),createInventory)
router.post('/search', searchorder)
router.get('/getalllaps',getInventory)

module.exports = router;