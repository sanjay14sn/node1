const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const connectDatabase = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// ✅ Initialize Firebase Admin SDK
let firebaseKeyPath;

if (fs.existsSync('/etc/secrets/firebaseServiceAccountKey.json')) {
  // 🔐 Render (Production)
  firebaseKeyPath = '/etc/secrets/firebaseServiceAccountKey.json';
} else {
  // 🧪 Local development
  firebaseKeyPath = path.join(__dirname, 'config', 'firebaseServiceAccountKey.json');
}

try {
  const serviceAccount = require(firebaseKeyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
  process.exit(1);
}

// Connect to MongoDB
connectDatabase();

// Middleware
app.use(express.json());
app.use(cors());
console.log('🌐 CORS enabled for all origins');

// Routes
const products = require('./routes/product');
const orders = require('./routes/order');
const userRoutes = require('./routes/user');
app.use('/api/v1', userRoutes);

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
