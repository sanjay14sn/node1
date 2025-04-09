const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name:{ type:String , required:true},
    price: { type:String , required:true},
    description : { type:String , required:true},
    ratings:{ type: String, default: "0" },
    images: [{
        Image:String,
    }],
    category:String,
    seller:String,
    stock:String,
    ratingcount:{ type: String, default: "0" },
    isfavourite:Boolean,
    createdat:Date,

});


const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;