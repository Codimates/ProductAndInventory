require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Database connection

mongoose
  .connect(process.env.REACT_APP_MONGO_URL)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Database not connected', err));

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routers
app.use('/', require('./routers/inventoryRoutes'))

const port = 4002;

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});