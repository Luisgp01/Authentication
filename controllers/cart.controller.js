const mongoose = require("mongoose");
const Product = require(".././models/checkout.model")
const product = Object.keys(require('../data/men-products'));
const User = require('../models/User.model');


module.exports.create = (req,res,next) => {
    res.render('/underwear/new', {
        products: product 
    });
};

module.exports.doCreate = (req,res,next) => {
    let underwearProducts = req.body.product

    if(underwearProducts && !Array.isArray(underwearProducts)){
        underwearProducts = [underwearProducts];
    }

    const products = new Product({
        products : req.body.products,
        user: req.body.user,
        adress: req.body.address,
        RSVP: req.body.RSVP,
        image: req.body.image || undefined
    });
    products
    .save()
    .then(() => res.redirect('/underwear/cart'))
    .catch((error) => {
        if(error instanceof mongoose.Error.ValidationError){
            res.status(400).render('/underwear/new', {
                errors: error.errors,
                products,
                products: product
            });
        } else {
            next(error);
        }
    })
}


module.exports.edit = (req,res,next) => {
    Product.findById(req.params.id)
    .then((products) => {
        res.render('/underwear/edit', {
            products,
            products: product,
        });
    })
    .catch(next)
};


module.exports.doEdit = (req,res,next) => {
    Product.findByIdAndUpdate(req.params.id,req.body,{runValidators: true, new: true})
    .then((products) => res.redirect(`/underwear/${products.id}`))
    .catch((error) => {
        if(error instanceof mongoose.Error.ValidationError) {
            req.body.id = req.params.id;
            res.status(400).render('/underwear/edit', {
                errors: error.errors,
                products: req.body,
                products: product
            });
        } else {
            next(error);
        }
    });
};

module.exports.delete = (req,res,next) => {
    Product.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/underwear'))
    .catch(error => next(error))
}