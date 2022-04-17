const Like = require("../models/like.model");

module.exports.profile = (req, res, next) => {
  Like.find({ user: req.user.id })
  .populate("product")
    .then((likes) => {
      console.log(likes);
      res.render("users/profile", { likes });
    })
    .catch(next);
};

module.exports.doLike = (req, res, next) => {
  const prodId = req.params.id;
  const userId = req.user.id;

  Like.findOneAndDelete({ product: prodId, user: userId })
    .then((like) => {
      if (like) {
        res.status(200).send({ success: "Like remove from DDBB" });
      } else {
        return Like.create({ product: prodId, user: userId }).then(() => {
          res.status(201).send({ success: "Like added to DDBB" });
        });
      }
    })
    .catch(next);
};
