const users = require('./routes/usercontroller');

app.use('/api/v1/', users); // Add this below product/order routes
