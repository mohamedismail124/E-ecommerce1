import { cartModel } from "../../../databases/models/cart.Model.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { productModel } from "./../../../databases/models/product.model.js";
import { AppError } from "./../../utils/AppError.js";
import { couponModel } from "./../../../databases/models/coupon.model.js";

function calcTotalPrice(cart) {
  let totalPrice = 0;
  cart.cartItems.forEach((elm) => {
    totalPrice += elm.quantity * elm.price;
  });
  cart.totalPrice = totalPrice;
}

const addProductToCart = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.body.product).select("price");
  if (!product) return next(new AppError("product not found", 404));

  req.body.price = product.price;

  let isCartExist = await cartModel.findOne({ user: req.user._id });
  if (isCartExist) {
    let cart = new cartModel({
      user: req.user._id,
      cartItems: [req.body],
    });
    calcTotalPrice(cart);
    await cart.save();

    return res.json({ message: "success", cart });
  }

  let item = isCartExist.cartItems.find(
    (elm) => elm.product == req.body.product
  );
  if (item) {
    item.quantity += req.body.quantity || 1;
  } else {
    isCartExist.cartItems.push(req.body);
  }
  calcTotalPrice(isCartExist);
  if(isCartExist.discount){
    isCartExist.totalPriceAfterDiscount =
    isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100;
  }



  await isCartExist.save();
  res.json({ message: "add to cart", cart: isCartExist });
});

const removeProductFromCart = catchAsyncError(async (req, res, next) => {
  let result = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );

  !result && next(new AppError(`item not found `, 404));
  calcTotalPrice(result)
  if(result.discount){
    result.totalPriceAfterDiscount =
    result.totalPrice - (result.totalPrice * result.discount) / 100;
  }
  result && res.json({ message: "success", cart:result });
});

const updateQuantity = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id).select("price");
  if (!product) return next(new AppError("product not found", 404));

  let item = isCartExist.cartItems.find((elm) => elm.product == req.params.id);
  if (item) {
    item.quantity = req.body.quantity || 1;
  }
  calcTotalPrice(isCartExist);

  if(isCartExist.discount){
    isCartExist.totalPriceAfterDiscount =
    isCartExist.totalPrice - (isCartExist.totalPrice * isCartExist.discount) / 100;
  }

  await isCartExist.save();
  res.json({ message: "success", cart: isCartExist });
});

const applyCoupon = catchAsyncError(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.code,
    expires: { $gt: Date.now() },
  });
  let cart = await cartModel.findOne({ user: req.user._id });
  cart.totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  
    cart.discount=coupon.discount
  await cart.save();
  res.json({ message: "success", cart })
});

const getLoggedUserCart = catchAsyncError(async (req, res, next) => {


  let cartItems = await cartModel.findOne({ user: req.user._id }).populate('cartItem.populate');


  
  res.json({ message: "success", cart: cartItems  });
});

export { addProductToCart, removeProductFromCart, updateQuantity, applyCoupon , getLoggedUserCart };
