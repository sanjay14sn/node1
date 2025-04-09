
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