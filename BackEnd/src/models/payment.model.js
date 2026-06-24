const mongoose = require('mongoose');

const paymentModel = mongoose.Schema({
    paymentId:{
        type:String,
    },
    name:String,
    adhar:String,
    email:String,
    address:String,
    occupation:String,
    street:String ,
    city: String,
    state: String,
    pincode: String,
    gender: String,
    orderId:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    signature:{
        type:String,
    },
    currency:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:'pending',
    },
    receipt:{
        tokenHash:String,
        url:String,
        issuedAt:Date,
        emailStatus:{
            type:String,
            enum:['not_configured','pending','sent','failed'],
        },
        emailSentAt:Date,
        emailError:String,
    }

},{timestamps:true});
module.exports= mongoose.model("payment",paymentModel);
