
const productModel = require('../models/productModel');


exports.getProducts = async (req , res ,next) => {

 const products = await  productModel.find({});
    res.json({
        success : true,
        products
    })
}

exports.getsingleProduct= (req , res ,next) => {
    res.json({
        success : true,
        message: 'single working'
    })
}

exports.createProduct = async (req, res, next) => {
  try {
    const userEmail = req.user.email; // From Firebase token
    const userId = req.user.uid;

    const newProduct = await productModel.create({
      ...req.body,
      createdBy: userEmail,
      creatorId: userId,
    });

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteProduct = async (req, res) => {
    try {
      const product = await productModel.findByIdAndDelete(req.params.id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  

// POST /products/:id/toggle-favourite
exports.toggleFavourite = async (req, res, next) => {
    try {
      const product = await productModel.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
  
      // Toggle the value
      product.isfavourite = !product.isfavourite;
      await product.save();
  
      res.status(200).json({
        success: true,
        message: `isfavourite set to ${product.isfavourite}`,
        product
      });
    } catch (error) {
      console.error("Toggle error:", error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  