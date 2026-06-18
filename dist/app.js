"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const category_route_1 = __importDefault(require("./modules/category/category.route"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const product_route_1 = __importDefault(require("./modules/product/product.route"));
const wishlist_route_1 = __importDefault(require("./modules/wishlist/wishlist.route"));
const cart_route_1 = __importDefault(require("./modules/cart/cart.route"));
const shipping_address_route_1 = __importDefault(require("./modules/shipping-address/shipping-address.route"));
const order_route_1 = __importDefault(require("./modules/order/order.route"));
const payment_route_1 = __importDefault(require("./modules/payment/payment.route"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
// routes
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/category", category_route_1.default);
app.use("/api/v1/product", product_route_1.default);
app.use("/api/v1/wishlist", wishlist_route_1.default);
app.use("/api/v1/cart", cart_route_1.default);
app.use("/api/v1/shipping-address", shipping_address_route_1.default);
app.use("/api/v1/order", order_route_1.default);
app.use("/api/v1/payment", payment_route_1.default);
app.get("/api/v1", (req, res) => {
    res.send("Hello World!");
});
app.get("/api/v1/docs.json", swagger_1.swaggerJsonHandler);
app.get("/api/v1/docs", swagger_1.swaggerUiHandler);
// global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
