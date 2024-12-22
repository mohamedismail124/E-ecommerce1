import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { brandModel } from "./../../../databases/models/brand.model.js";
import * as factory from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const createBrand = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;

  let result = new brandModel(req.body);

  await result.save();

  res.json({ message: "success", result });
});

const getAllBrands = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  let result = await apiFeatures.mongooseQuery;

  res.json({ message: "success", page: apiFeatures.page, result });
});

const getBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await brandModel.findById(id);

  if (!result) {
    return next(new AppError(`Brand not found`, 404));
  }

  res.json({ message: "success", result });
});

const updateBrand = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;

  let result = await brandModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  if (!result) {
    return next(new AppError(`Brand not found`, 404));
  }

  res.json({ message: "success", result });
});

const deleteBrand = factory.deleteOne(brandModel);

export { createBrand, getAllBrands, getBrand, updateBrand, deleteBrand };
