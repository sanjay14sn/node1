const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/db');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Load Firebase credentials
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./config/firebaseServiceAccountKey.json'); // fallback for local dev only

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(express.json());
app.use(cors());
console.log('🌐 CORS enabled for all origins');

// Import Routes
const products = require('./routes/product');
const orders = require('./routes/order');

// API Routes
app.use('/api/v1/', products);
app.use('/api/v1/', orders);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
