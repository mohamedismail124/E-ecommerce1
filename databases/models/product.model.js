import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short category name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "product price required"],
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    ratingAvg: {
      type: Number,
      min: [1, "rating average must be greater than 1"],
      max: [5, "rating average must be less than 5"],
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      minLength: [5, "too short product description"],
      maxLength: [300, "too long product description"],
      required: [true, "product description required"],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
      required: [true, "product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    imgCover: String,
    images: [String],
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "product category required"],
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
      required: [true, "product subCategory required"],
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "brand",
      required: [true, "product brand required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.post("init", (doc) => {
  doc.imgCover = process.env.BASE_URL + "/product/" + doc.imgCover;
  doc.images = doc.images.map(
    (path) => process.env.BASE_URL + "/product/" + path
  );
});

productSchema.virtual("myReviews", {
  ref: "review",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre(/^find/, function () {
  this.populate("myReviews");
});

export const productModel = mongoose.model("product", productSchema);
