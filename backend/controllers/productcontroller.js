
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
        const newProduct = await productModel.create(req.body);
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

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await product.deleteOne(); // or product.remove()
        
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
