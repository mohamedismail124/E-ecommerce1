import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factory from "../handlers/factor.handler.js";
import { productModel } from "./../../../databases/models/product.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const createProduct = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  req.body.imgCover=req.files.imgCover[0].filename
  req.body.images=req.files.images.map(obj=>obj.filename)
  let result = new productModel(req.body);

  await result.save();

  res.json({ message: "success", result });
});

const getAllProducts = catchAsyncError(async (req, res) => {
  //build query
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  //execute query
  let result = await apiFeatures.mongooseQuery;

  res.json({ message: "success", page: apiFeatures.page, result });
});

const getProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await productModel.findById(id);

  !result && next(new AppError(`Brand not found`, 404));
  result && res.json({ message: "success", result });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title);

  let result = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !result && next(new AppError(`Brand not found`, 404));
  result && res.json({ message: "success", result });
});

const deleteProduct = factory.deleteOne(productModel);

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
