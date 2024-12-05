const express = require('express');
const router = express.Router();
const cors = require('cors');
const upload = require('../helpers/upload');

// Updated CORS configuration
router.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    })
);

const { createInventory,searchorder, getInventory } = require('../controllers/inventoryController');


router.post('/create', upload.array('images',3),createInventory)
router.post('/search', searchorder)
router.get('/getalllaps',getInventory)

module.exports = router;