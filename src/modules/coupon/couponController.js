import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import * as factory from "../handlers/factor.handler.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { couponModel } from "../../../databases/models/coupon.model.js";
import QRCode from "qrcode";

const createCoupon = catchAsyncError(async (req, res) => {
  let result = new couponModel(req.body);

  await result.save();

  res.json({ message: "success", result });
});

const getAllCoupons = catchAsyncError(async (req, res) => {
  let apiFeatures = new ApiFeatures(
    couponModel.find().populate("user", "name"),
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

const getCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await couponModel.findById(id);
  let url = await  QRCode.toDataURL(result.code);

  !result && next(new AppError(`Coupon not found`, 404));
  result && res.json({ message: "success", result, url });
});

const updateCoupon = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let result = await couponModel.findOneAndUpdate(id, req.body, { new: true });

  !result &&
    next(
      new AppError(
        `Coupon not found or you are not authorized to perform this action`,
        404
      )
    );
  result && res.json({ message: "success", result });
});

const deleteCoupon = factory.deleteOne(couponModel);

export { createCoupon, getAllCoupons, getCoupon, updateCoupon, deleteCoupon };
