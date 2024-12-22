import { AppError } from "../../utils/AppError.js";
import { userModel } from "../../../databases/models/user.model.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";





const addAddress = catchAsyncError(async (req, res, next) => {


  let result = await userModel.findByIdAndUpdate(
   req.user._id ,
    {$addTSet:{addresses:req.body}},
    { new: true }
  );

  !result && next(new AppError(`address not found `, 404))
  result && res.json({ message: "success", result:result.addresses});
});

const removeAddress= catchAsyncError(async (req, res, next) => {
    let result = await userModel.findByIdAndUpdate(
        req.user._id ,
         {$pull:{addresses:{_id:req.body.address}}},
         { new: true }
       );
     
       !result && next(new AppError(`address not found `, 404))
       result && res.json({ message: "success", result:result.addresses});
});

const getAllUserAddress = catchAsyncError(async (req, res, next) => {
 

  let result = await userModel.findOne({_id:req.user._id})
  !result && next(new AppError(`address not found `, 404))
  result && res.json({ message: "success", result:result.addresses });
});

export {  addAddress  ,removeAddress ,getAllUserAddress};
