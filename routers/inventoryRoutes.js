const express = require('express');
const router = express.Router();

const { createInventory } = require('../controllers/inventoryController')

router.post('/create', createInventory)

module.exports = router;