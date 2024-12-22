import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "./../../../databases/models/cart.Model.js";
import { orderModel } from "./../../../databases/models/order.model.js";
import { productModel } from "./../../../databases/models/product.model.js";
import Stripe from "stripe";
import { userModel } from "./../../../databases/models/user.model.js";

const stripe = new Stripe("SK_test");

const createCashOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);

  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  const order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  }); 
  await order.save();

  if (order) {
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await productModel.bulkWrite(options);

    await cartModel.findByIdAndDelete(req.params.id);

    return res.json({ message: "success", order });
  } else {
    return next(new AppError("error in cart id", 404));
  }
});

const getSpecificOrder = catchAsyncError(async (req, res, next) => {
  let order = await orderModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");
  res.json({ message: "success", order });
});

const getAllOrders = catchAsyncError(async (req, res, next) => {
  let orders = await orderModel.find({}).populate("cartItems.product");
  res.json({ message: "success", orders });
});

const createCheckOutSession = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);

  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egy",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://route-comm.netlify.app/#/", // front
    cancel_url: "https://route-comm.netlify.app/#/cart",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });
  res.json({ message: "success", session });
});

const createOnlineOrder = catchAsyncError((request, response) => {
  const sig = request.headers["stripe-signature"].toString();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      "whsec_z2PP9V8EI2KHmV2OfzsiW8xV4MlD8rmD"
    );
  } catch (err) {
    return response.send(`webhook Error:${err.message}`);
  }

  if (event.type == " checkout.session.completed") {
    card(event.data.object);
    console.log("create order here......");
  } else {
    console.log(`unhandled event type ${event.type}`);
  }
});

const getLoggedUserOrder = catchAsyncError(async (req, res, next) => {
  // Fetch all orders associated with the logged-in user
  const orders = await orderModel
    .find({ user: req.user._id })
    .populate("cartItems.product");

  if (!orders || orders.length === 0) {
    return next(new AppError("No orders found for this user", 404));
  }

  res.json({
    message: "success",
    orders,
  });
});


async function card(e) {
  const cart = await cartModel.findById(e.client_reference_id);
  if (!cart) return next(new AppError("cart not found", 404));
  let user = await userModel.findOne({ email: e.customer_email });

  const order = new orderModel({
    user: user._id,
    cartItems: cart.cartItems,
    totalOrderPrice: e.amount_total / 100,
    shippingAddress: e.metadata.shippingAddress,
    paymentType: "card",
    isPaid: true,
    paidAt: Date.now,
  });
  await order.save();
  if (order) {
    let option = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { sold: item.quantity, quantity: -item.quantity } },
      },
    }));
    await productModel.bulkWrite(option);

    await cartModel.findOneAndDelete({ user: user._id });

    return res.json({ message: "success", order });
  }
  return next(new AppError("order not found", 404));
}


export {
  createCashOrder,
  getSpecificOrder,
  getAllOrders,
  createCheckOutSession,
  createOnlineOrder,
  getLoggedUserOrder,
};

