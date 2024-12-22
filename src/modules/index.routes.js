import { globalErrorMiddleware } from "../middleware/globalErrorMiddleware.js";
import { AppError } from "../utils/AppError.js";
import addressRouter from "./address/address.router.js";
import authRouter from "./auth/auth.router.js";
import brandRouter from "./brands/brand.router.js";
import cartRouter from "./cart/cart.router.js";
import categoryRouter from "./category/category.router.js";
import couponRouter from "./coupon/coupon.router.js";
import orderRouter from "./order/order.router.js";
import productRouter from "./product/product.router.js";
import reviewRouter from "./review/review.router.js";
import subCategoryRouter from "./subcategory/subcategory.router.js";
import userRouter from "./user/user.router.js";
import wishlistRouter from "./wishlist/wishlist.router.js";

export function init(app) {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/carts", cartRouter);
  app.use("/api/v1/orders", orderRouter);

  app.all("*", (req, res, next) => {
    next(new AppError(`can't find this route: ${req.originalUrl}`, 404));
  });

  //global error handling middleware
  app.use(globalErrorMiddleware);
}
