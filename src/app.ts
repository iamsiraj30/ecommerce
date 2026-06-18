import express, { Application, Request, Response } from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.route";
import categoryRouter from "./modules/category/category.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import productRouter from "./modules/product/product.route";
import wishlistRouter from "./modules/wishlist/wishlist.route";
import cartRouter from "./modules/cart/cart.route";
import shippingAddressRouter from "./modules/shipping-address/shipping-address.route";
import orderRouter from "./modules/order/order.route";
import paymentRouter from "./modules/payment/payment.route";
import { swaggerJsonHandler, swaggerUiHandler } from "./swagger";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/shipping-address", shippingAddressRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", paymentRouter);

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/v1/docs.json", swaggerJsonHandler);
app.get("/api/v1/docs", swaggerUiHandler);

// global error handler
app.use(globalErrorHandler);

export default app;
