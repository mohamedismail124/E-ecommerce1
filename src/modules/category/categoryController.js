import { categoryModel } from "../../../databases/models/category.model.js";
import slugify from "slugify";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factory from "../handlers/factor.handler.js";
import { ApiFeatures } from "./../../utils/ApiFeatures.js";


const createCategory = catchAsyncError(async (req, res) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;

  let result = new categoryModel(req.body);

  await result.save();

  res.json({ message: "success", result });
});

const getAllCategories = catchAsyncError(async (req, res) => {
  //build query
  let apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  //execute query
  let result = await apiFeatures.mongooseQuery;

  res.json({ message: "success", page: apiFeatures.page, result });
});

const getCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await categoryModel.findById(id);

  !result && next(new AppError(`category not found`, 404));
  result && res.json({ message: "success", result });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;

  let result = await categoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !result && next(new AppError(`category not found`, 404));
  result && res.json({ message: "success", result });
});

const deleteCategory = factory.deleteOne(categoryModel);

export {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
