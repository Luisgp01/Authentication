const mongoose = require ("mongoose");
const Schema= mongoose.Schema;

const menProductsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Name is required"],
    },
    main_image: {
      type: String,
      required: [true, "Main picture is required"],
    },
    image_2: {
      type: String,
    },
    image_3: {
      type: String,
    },
    image_4: {
      type: String,
    },
    fashion_product_type: {
      type: String,
      enum: ["Slips", "Boxers", "Camisetas Interiores", "Calzoncillos largos"],
    },
    fashion_main_description: {
      type: String,
    },
    sizes: {
      type: String,
    },
    fashion_secundary_color: {
      type: String,
    },
    product_mp_id: {
      type: String,
      required: true,
    },
    parent: {
      type: Boolean,
    },
    RSVP:{
      type:Number,
      required: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.social;
        return ret;
      },
    },
  }
);


  const Product = mongoose.model("Product", menProductsSchema);
  module.exports = Product;