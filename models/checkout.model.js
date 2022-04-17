const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    products: [{type: Schema.Types.ObjectId, ref: 'men-product' }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    adress:  {
        city: String,
        zipCode: Number,
    },
    RSVP: {
        type: Number,
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'men-products',
        required: true
    },
    fashion_main_description: {
      type: String,
      required : true
    }
});

const done = 0;
for(let i = 0; i< userSchema.length; i++) {
    userSchema[i].save(function(err, result){
        done++;
        if(done === userSchema.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}

const Product = mongoose.model('products', userSchema)
module.exports = Product 
