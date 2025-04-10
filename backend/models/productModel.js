const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name:{ type:String , default: ""},
    price: String,
    description :String,
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
    createdBy: {
        type: String,
        required: false
      },
      creatorId: {
        type: String,
        required: false
      },
      

});


const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;