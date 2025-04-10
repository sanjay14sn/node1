const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/db');
const admin = require('firebase-admin');
const fs = require('fs');

// Load env vars
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// ✅ Load Firebase Service Account
let serviceAccount;

if (process.env.FIREBASE_CONFIG) {
  // Render / Production
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG.replace(/\\n/g, '\n'));
  } catch (error) {
    console.error('❌ Error parsing FIREBASE_CONFIG:', error.message);
    process.exit(1);
  }
} else {
  // Local development
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'config', 'firebaseServiceAccountKey.json'));
    serviceAccount = JSON.parse(raw);
  } catch (error) {
    console.error('❌ Failed to load local firebaseServiceAccountKey.json:', error.message);
    process.exit(1);
  }
}

// Use secret file path in Render, fallback to local path
const firebaseKeyPath = fs.existsSync('/etc/secrets/firebaseServiceAccountKey.json')
  ? '/etc/secrets/firebaseServiceAccountKey.json' // Render
  : path.join(__dirname, 'config', 'firebaseServiceAccountKey.json'); // Local

admin.initializeApp({
  credential: admin.credential.cert(require(firebaseKeyPath)),
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
