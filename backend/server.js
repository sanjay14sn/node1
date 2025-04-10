const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/db');
const admin = require('firebase-admin');

// Load env vars
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// ✅ Load Firebase Service Account
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production (Render) - parse directly without replace
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT:', err);
    throw err;
  }
} else {
  // Local
  serviceAccount = require('./config/firebaseServiceAccountKey.json');
}

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

// Routes
const products = require('./routes/product');
const orders = require('./routes/order');

app.use('/api/v1/', products);
app.use('/api/v1/', orders);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
