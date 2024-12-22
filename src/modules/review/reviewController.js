import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factory from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { reviewModel } from "../../../databases/models/review.model.js";



const createReview = catchAsyncError(async (req, res) => {
  req.body.user = req.user._id;
  let isReview = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isReview) return next(AppError("you created a review before", 409));

  let result = new reviewModel(req.body);

  await result.save();

  res.json({ message: "success", result });
});

const getAllReviews = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(
    reviewModel.find().populate("user", "name"),
    req.query
  )
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();

  let result = await apiFeatures.mongooseQuery;

  res.json({ message: "success", page: apiFeatures.page, result });
});

const getReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await reviewModel.findById(id);

  !result && next(new AppError(`Review not found`, 404));
  result && res.json({ message: "success", result });
});

const updateReview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await reviewModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    req.body,
    { new: true }
  );

  !result &&
    next(
      new AppError(
        `Review not found or you are not authorized to perform this action`,
        404
      )
    );
  result && res.json({ message: "success", result });
});

const deleteReview = factory.deleteOne(reviewModel);

export { createReview, getAllReviews, getReview, updateReview, deleteReview };
