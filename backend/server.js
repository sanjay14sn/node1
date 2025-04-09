const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

const products = require('./routes/product');
const orders = require('./routes/order');
const { console } = require('inspector');

connectDatabase();

// ✅ use . instead of ,
app.use('/api/v1/', products);
app.use('/api/v1/', orders);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT} in production`);
});
