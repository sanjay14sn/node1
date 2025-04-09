const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: String,
    price: String,
    description : String,
    ratings: String,
    images: [{
        Image:String,
    }],
    category:String,
    seller:String,
    stock:String,
    ratingcount:String,
    isfavourite:Boolean,
    createdat:Date,

});


const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;