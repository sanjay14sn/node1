const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');

// Load env vars
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Connect to MongoDB
connectDatabase();

// Middleware to parse JSON
app.use(express.json());

// Import Routes
const products = require('./routes/product');
const orders = require('./routes/order');

// Route Middleware
app.use('/api/v1/', products);
app.use('/api/v1/', orders);

// Optional: Fallback route to check if server is up
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use dynamic port for Render, fallback to 8000 for local dev
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
