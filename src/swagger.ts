import { Request, Response } from "express";

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Ecommerce Backend API",
    version: "1.0.0",
    description: "Swagger documentation for the ecommerce backend API routes.",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "API health check" },
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Category", description: "Category management" },
    { name: "Product", description: "Product management" },
    { name: "Wishlist", description: "Wishlist management" },
    { name: "Cart", description: "Cart management" },
    { name: "Shipping Address", description: "Shipping address management" },
    { name: "Order", description: "Order management & checkout" },
    { name: "Payment", description: "Payment management" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
          data: { nullable: true },
          meta: { $ref: "#/components/schemas/PaginationMeta" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Something went wrong" },
          error: { type: "object" },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 25 },
          totalPage: { type: "integer", example: 3 },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email" },
          profileImg: { type: "string", nullable: true },
          phone: { type: "string", nullable: true },
          address: { type: "string", nullable: true },
          age: { type: "integer", nullable: true },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
          isVerified: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "John Doe" },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "secret123",
          },
          phone: { type: "string", example: "+8801700000000" },
          address: { type: "string", example: "Dhaka, Bangladesh" },
          age: { type: "integer", example: 25 },
          isVerified: { type: "boolean", example: false },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "secret123",
          },
        },
      },
      LoginResponseData: {
        type: "object",
        properties: {
          accessToken: { type: "string", example: "jwt.token.here" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string", example: "Electronics" },
          description: { type: "string", nullable: true },
          thumbnail: { type: "string", nullable: true },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CategoryRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", example: "Electronics" },
          description: { type: "string", example: "Electronic products" },
          thumbnail: { type: "string", example: "/uploads/category.png" },
        },
      },
      ProductImage: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          image: { type: "string", example: "/uploads/product.png" },
          productId: { type: "string", format: "uuid", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Smartphone" },
          description: { type: "string", example: "A modern smartphone" },
          price: { type: "number", example: 499.99 },
          stock: { type: "integer", example: 20 },
          isFeatured: { type: "boolean", example: false },
          thumbnail: { type: "string", example: "/uploads/thumbnail.png" },
          categoryId: { type: "string", format: "uuid" },
          category: {
            type: "object",
            nullable: true,
            properties: {
              id: { type: "string", format: "uuid" },
              title: { type: "string", example: "Electronics" },
            },
          },
          productImages: {
            type: "array",
            items: { $ref: "#/components/schemas/ProductImage" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      WishlistItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          productId: { type: "string", format: "uuid" },
          product: { $ref: "#/components/schemas/Product" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AddWishlistRequest: {
        type: "object",
        required: ["productId"],
        properties: {
          productId: { type: "string", format: "uuid" },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          cartId: { type: "string", format: "uuid" },
          productId: { type: "string", format: "uuid" },
          quantity: { type: "integer", example: 2 },
          product: { $ref: "#/components/schemas/Product" },
          subTotal: { type: "number", example: 999.98 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Cart: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" },
          },
          totalQuantity: { type: "integer", example: 2 },
          totalPrice: { type: "number", example: 999.98 },
        },
      },
      AddCartRequest: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string", format: "uuid" },
          quantity: { type: "integer", minimum: 1, example: 1 },
        },
      },
      UpdateCartQuantityRequest: {
        type: "object",
        required: ["action"],
        properties: {
          action: { type: "string", enum: ["increase", "decrease"] },
        },
      },
      ShippingAddress: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          fullName: { type: "string", example: "John Doe" },
          userId: { type: "string", format: "uuid" },
          phone: { type: "string", example: "+8801700000000" },
          addressLine1: { type: "string", example: "123 Main Street" },
          addressLine2: { type: "string", nullable: true, example: "Apt 4B" },
          city: { type: "string", example: "Dhaka" },
          state: { type: "string", nullable: true, example: "Dhaka Division" },
          country: { type: "string", example: "Bangladesh" },
          postalCode: { type: "string", example: "1205" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateShippingAddressRequest: {
        type: "object",
        required: [
          "fullName",
          "phone",
          "addressLine1",
          "city",
          "country",
          "postalCode",
        ],
        properties: {
          fullName: { type: "string", example: "John Doe" },
          phone: { type: "string", example: "+8801700000000" },
          addressLine1: { type: "string", example: "123 Main Street" },
          addressLine2: { type: "string", example: "Apt 4B" },
          city: { type: "string", example: "Dhaka" },
          state: { type: "string", example: "Dhaka Division" },
          country: { type: "string", example: "Bangladesh" },
          postalCode: { type: "string", example: "1205" },
        },
      },
      UpdateShippingAddressRequest: {
        type: "object",
        properties: {
          fullName: { type: "string", example: "John Doe" },
          phone: { type: "string", example: "+8801700000000" },
          addressLine1: { type: "string", example: "123 Main Street" },
          addressLine2: { type: "string", example: "Apt 4B" },
          city: { type: "string", example: "Dhaka" },
          state: { type: "string", example: "Dhaka Division" },
          country: { type: "string", example: "Bangladesh" },
          postalCode: { type: "string", example: "1205" },
        },
      },
      OrderItemProduct: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Smartphone" },
          thumbnail: { type: "string", example: "/uploads/thumbnail.png" },
          price: { type: "number", example: 499.99 },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          orderId: { type: "string", format: "uuid" },
          productId: { type: "string", format: "uuid" },
          quantity: { type: "integer", example: 2 },
          unitPrice: { type: "number", example: 499.99 },
          totalPrice: { type: "number", example: 999.98 },
          product: { $ref: "#/components/schemas/OrderItemProduct" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      PaymentSummary: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          amount: { type: "number", example: 999.98 },
          provider: { type: "string", example: "COD" },
          method: { type: "string", nullable: true, example: null },
          status: {
            type: "string",
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
          },
          transactionId: { type: "string", nullable: true },
          paidAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          orderNumber: { type: "string", example: "ORD-M1A2B3-X4Y5" },
          userId: { type: "string", format: "uuid" },
          shippingAddressId: { type: "string", format: "uuid" },
          subtotal: { type: "number", example: 999.98 },
          discountAmount: { type: "number", example: 0 },
          totalAmount: { type: "number", example: 999.98 },
          paymentStatus: {
            type: "string",
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
          },
          orderStatus: {
            type: "string",
            enum: [
              "PENDING",
              "PROCESSING",
              "SHIPPED",
              "DELIVERED",
              "CANCELLED",
            ],
          },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
          shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
          payments: {
            type: "array",
            items: { $ref: "#/components/schemas/PaymentSummary" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AdminOrder: {
        type: "object",
        description: "Order with user info (admin view)",
        allOf: [
          { $ref: "#/components/schemas/Order" },
          {
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  phone: { type: "string", nullable: true },
                },
              },
            },
          },
        ],
      },
      CheckoutRequest: {
        type: "object",
        required: ["shippingAddressId"],
        properties: {
          shippingAddressId: { type: "string", format: "uuid" },
          paymentMethod: {
            type: "string",
            example: "COD",
            description: "Payment provider. Defaults to COD.",
          },
        },
      },
      UpdateOrderStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: [
              "PENDING",
              "PROCESSING",
              "SHIPPED",
              "DELIVERED",
              "CANCELLED",
            ],
          },
        },
      },
      UpdatePaymentStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
          },
        },
      },
      Payment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          orderId: { type: "string", format: "uuid" },
          amount: { type: "number", example: 999.98 },
          provider: { type: "string", example: "COD" },
          method: { type: "string", nullable: true },
          status: {
            type: "string",
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
          },
          transactionId: { type: "string", nullable: true },
          paymentIntentId: { type: "string", nullable: true },
          rawResponse: { type: "object", nullable: true },
          paidAt: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          order: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              orderNumber: { type: "string", example: "ORD-M1A2B3-X4Y5" },
              totalAmount: { type: "number", example: 999.98 },
              orderStatus: { type: "string" },
              paymentStatus: { type: "string" },
            },
          },
        },
      },
      AdminPayment: {
        type: "object",
        description: "Payment with user info (admin view)",
        allOf: [
          { $ref: "#/components/schemas/Payment" },
          {
            type: "object",
            properties: {
              order: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  orderNumber: { type: "string" },
                  totalAmount: { type: "number" },
                  orderStatus: { type: "string" },
                  paymentStatus: { type: "string" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      email: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
    responses: {
      Unauthorized: {
        description: "Authentication is required or token is invalid.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "The authenticated user does not have permission.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "The requested resource was not found.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
  paths: {
    "/api/v1": {
      get: {
        tags: ["Health"],
        summary: "API health check",
        responses: {
          "200": {
            description: "Backend is running.",
            content: {
              "text/plain": {
                schema: { type: "string", example: "Hello World!" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/User" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          $ref: "#/components/schemas/LoginResponseData",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/Unauthorized" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/category": {
      get: {
        tags: ["Category"],
        summary: "Get all categories",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Categories retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Category" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Category"],
        summary: "Create a category",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Category created successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Category" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/api/v1/category/{id}": {
      patch: {
        tags: ["Category"],
        summary: "Update a category",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Category updated successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Category" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Category"],
        summary: "Delete a category",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Category deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/product": {
      get: {
        tags: ["Product"],
        summary: "Get all products",
        responses: {
          "200": {
            description: "Products retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Product" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Product"],
        summary: "Create a product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "price", "categoryId", "thumbnail"],
                properties: {
                  name: { type: "string", example: "Smartphone" },
                  description: {
                    type: "string",
                    example: "A modern smartphone",
                  },
                  price: { type: "number", example: 499.99 },
                  stock: { type: "integer", example: 20 },
                  isFeatured: { type: "boolean", example: false },
                  categoryId: { type: "string", format: "uuid" },
                  thumbnail: { type: "string", format: "binary" },
                  productImages: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Product created successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Product" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/product/{id}": {
      delete: {
        tags: ["Product"],
        summary: "Delete a product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Product deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/v1/wishlist": {
      get: {
        tags: ["Wishlist"],
        summary: "Get authenticated user's wishlist",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Wishlist retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/WishlistItem" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Wishlist"],
        summary: "Add product to wishlist",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddWishlistRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Product added to wishlist.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/wishlist/all": {
      delete: {
        tags: ["Wishlist"],
        summary: "Remove all wishlist items for authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "All wishlist items removed successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            deletedCount: { type: "integer", example: 3 },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/wishlist/{id}": {
      delete: {
        tags: ["Wishlist"],
        summary: "Remove one wishlist item",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "201": {
            description: "Product removed from wishlist.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/cart": {
      get: {
        tags: ["Cart"],
        summary: "Get authenticated user's cart",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Cart retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Cart" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Cart"],
        summary: "Add product to cart",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddCartRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Product added to cart successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/CartItem" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Insufficient stock or invalid request.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/cart/{id}": {
      patch: {
        tags: ["Cart"],
        summary: "Increase or decrease a cart item quantity",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateCartQuantityRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Cart item quantity updated successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          oneOf: [
                            { $ref: "#/components/schemas/CartItem" },
                            { type: "object", nullable: true },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Invalid action or insufficient stock.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove a cart item",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Cart item removed successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },
    // ========== SHIPPING ADDRESS ==========
    "/api/v1/shipping-address": {
      post: {
        tags: ["Shipping Address"],
        summary: "Create a shipping address",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateShippingAddressRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Shipping address created successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/ShippingAddress" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Validation error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
      get: {
        tags: ["Shipping Address"],
        summary: "Get my shipping addresses",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Shipping addresses retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/ShippingAddress",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/shipping-address/{id}": {
      get: {
        tags: ["Shipping Address"],
        summary: "Get a shipping address by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Shipping address retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/ShippingAddress" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Shipping Address"],
        summary: "Update a shipping address",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateShippingAddressRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Shipping address updated successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/ShippingAddress" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Shipping Address"],
        summary: "Delete a shipping address",
        description:
          "Deletes a shipping address. Will fail if the address is linked to active orders (PENDING, PROCESSING, or SHIPPED).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Shipping address deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          "400": {
            description: "Cannot delete — address is linked to active orders.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    // ========== ORDER ==========
    "/api/v1/order/checkout": {
      post: {
        tags: ["Order"],
        summary: "Checkout — create order from cart",
        description:
          "Creates an order from the user's cart. Validates shipping address, stock availability, calculates totals, creates order + items, decrements stock, creates payment record (COD by default), and clears the cart. All operations run in a transaction.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CheckoutRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Order placed successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Order" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description:
              "Cart is empty, insufficient stock, or missing shippingAddressId.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/order/my-orders": {
      get: {
        tags: ["Order"],
        summary: "Get my orders (paginated)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
            description: "Items per page",
          },
        ],
        responses: {
          "200": {
            description: "Orders retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Order" },
                        },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/order/my-orders/{id}": {
      get: {
        tags: ["Order"],
        summary: "Get a single order by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Order retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Order" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/order/my-orders/{id}/cancel": {
      patch: {
        tags: ["Order"],
        summary: "Cancel a pending order",
        description:
          "Cancels an order. Only orders with status PENDING can be cancelled. Stock is restored for all items.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Order cancelled successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Order" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Only PENDING orders can be cancelled.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/order/admin/all": {
      get: {
        tags: ["Order"],
        summary: "[Admin] Get all orders (paginated + filtered)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "orderStatus",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "PENDING",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
              ],
            },
            description: "Filter by order status",
          },
          {
            name: "paymentStatus",
            in: "query",
            schema: {
              type: "string",
              enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            },
            description: "Filter by payment status",
          },
        ],
        responses: {
          "200": {
            description: "All orders retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/AdminOrder" },
                        },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/order/admin/{id}/status": {
      patch: {
        tags: ["Order"],
        summary: "[Admin] Update order status",
        description:
          "Updates the order status. Cannot update CANCELLED or DELIVERED orders. If setting to CANCELLED, stock is automatically restored.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderStatusRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Order status updated successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Order" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Invalid status or cannot update.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/order/admin/{id}/payment-status": {
      patch: {
        tags: ["Order"],
        summary: "[Admin] Update payment status",
        description:
          "Updates the payment status for an order. When setting to PAID, the paidAt timestamp is automatically set.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdatePaymentStatusRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Payment status updated successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Order" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Invalid payment status.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    // ========== PAYMENT ==========
    "/api/v1/payment/order/{orderId}": {
      get: {
        tags: ["Payment"],
        summary: "Get payments for a specific order",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Payments retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Payment" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/payment/my-payments": {
      get: {
        tags: ["Payment"],
        summary: "Get all my payments (paginated)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Payments retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Payment" },
                        },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/api/v1/payment/cod/{orderId}/confirm": {
      patch: {
        tags: ["Payment"],
        summary: "Confirm COD payment",
        description:
          "Confirms Cash on Delivery payment for a delivered order. Only works when order status is DELIVERED and payment is not already PAID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "orderId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "COD payment confirmed successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/PaymentSummary" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description:
              "Order not delivered yet, already paid, or no COD payment found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/payment/admin/all": {
      get: {
        tags: ["Payment"],
        summary: "[Admin] Get all payments (paginated + filtered)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            },
            description: "Filter by payment status",
          },
          {
            name: "provider",
            in: "query",
            schema: { type: "string" },
            description: "Filter by provider (e.g. COD, STRIPE, SSLCOMMERZ)",
          },
        ],
        responses: {
          "200": {
            description: "All payments retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/AdminPayment" },
                        },
                        meta: { $ref: "#/components/schemas/PaginationMeta" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/payment/admin/{id}": {
      get: {
        tags: ["Payment"],
        summary: "[Admin] Get a single payment by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Payment retrieved successfully.",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/AdminPayment" },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

export const swaggerJsonHandler = (_req: Request, res: Response) => {
  res.json(swaggerSpec);
};

export const swaggerUiHandler = (_req: Request, res: Response) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ecommerce Backend API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/api/v1/docs.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        persistAuthorization: true
      });
    </script>
  </body>
</html>`);
};
