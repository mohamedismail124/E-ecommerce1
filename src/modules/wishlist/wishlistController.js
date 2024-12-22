import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { userModel } from "../../../databases/models/user.model.js";




const addToWishlist = catchAsyncError(async (req, res, next) => {
  const {product} = req.body;

  let result = await userModel.findByIdAndUpdate(
   req.user._id ,
    {$addTSet:{wishlist:product}},
    { new: true }
  );

  !result && next(new AppError(`Review not found `, 404))
  result && res.json({ message: "success", result:result.wishlist });
});

const removeFromWishlist = catchAsyncError(async (req, res, next) => {
  const {product} = req.body;

  let result = await userModel.findByIdAndUpdate(
   req.user._id ,
    {$pull:{wishlist:product}},
    { new: true }
  );

  !result && next(new AppError(`Review not found `, 404))
  result && res.json({ message: "success", result:result.wishlist });
});

const getAllUserWishlist = catchAsyncError(async (req, res, next) => {
 

  let result = await userModel.findOne({_id:req.user._id}).populate('wishlist')
  !result && next(new AppError(`Review not found `, 404))
  result && res.json({ message: "success", result:result.wishlist });
});

export { addToWishlist ,  removeFromWishlist ,getAllUserWishlist};
