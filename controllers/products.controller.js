const mongoose = require("mongoose");
const Products = require("../models/men-products.model");
const categories = Object.keys(require("../data/categories.json"));
const PER_PAGE=12;
const Like = require("../models/like.model");



module.exports.list = (req, res, next) => {
   const page= req.params.page ? Number (req.params.page) : 1;
  const category = req.query.category 
  Like.find({user: req.user.id})
  .then(likes=>{
  return Products.find({
  parent: true,
  ...(category && { fashion_product_type: category }),
})
  .sort({ createdAt: "desc" })
  .limit(PER_PAGE)
  .skip((page - 1) * PER_PAGE)
  .then((products) => {
    if (products.length > 0) {
      return Products.countDocuments({
        parent: true,
        ...(category && { fashion_product_type: category }),
      }).then((count) => {
        const pagesCount = Math.ceil(count / PER_PAGE);
        res.render("products/list", {
          likes,
          products,
          pagesCount,
          page,
          category,
        });
      });
    } else {
      res.redirect("../views/error.hbs");
    }
  })
  .catch((error) => next(error));
  })
};

module.exports.detail = (req, res, next) => {
  Products.findById(req.params.id)
    .then((product) => {
      Products.find({ product_mp_id: product.product_mp_id, parent: false })
        .then(variants => {
          if (product && variants) {
            console.log(variants)
            res.render("products/detail", { product, variants });
          } else {
            res.redirect("/products");
          }
        })
    })
    .catch((error) => next(error));
};


