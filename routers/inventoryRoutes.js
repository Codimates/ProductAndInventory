const express = require('express');
const router = express.Router();

const { createInventory,searchorder } = require('../controllers/inventoryController')

router.post('/create', createInventory)
router.post('/search', searchorder)

module.exports = router;