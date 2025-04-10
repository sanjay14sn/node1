const express = require('express');
const Router = express.Router();
const verifyFirebaseToken = require('../middlewares/authMiddleware');


const {
  getProducts,
  getsingleProduct,
  createProduct,
  deleteProduct,
  toggleFavourite,
} = require('../controllers/productcontroller');

// ✅ Test Route for Firebase Auth
Router.get('/test-auth', verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token verified successfully!',
    user: req.user, // This will have uid, email, etc.
  });
});

// Product Routes
Router.route('/products')
  .get(getProducts)
  .post(verifyFirebaseToken, createProduct); // Protected route

Router.route('/product/:id')
  .get(getsingleProduct)
  .delete(verifyFirebaseToken, deleteProduct); // Protect delete

Router.post('/products/:id/toggle-favourite', verifyFirebaseToken, toggleFavourite); // Optional auth

module.exports = Router;
