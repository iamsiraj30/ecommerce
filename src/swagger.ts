import { Request, Response } from "express";

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Ecommerce Backend API",
    version: "1.0.0",
    description:
      "Swagger documentation for the ecommerce backend API routes.",
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
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", format: "password", example: "secret123" },
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
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", format: "password", example: "secret123" },
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
          "400": { $ref: "#/components/responses/Unauthorized" },
          "401": { $ref: "#/components/responses/Unauthorized" },
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
                        data: { $ref: "#/components/schemas/LoginResponseData" },
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
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
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
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
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
                  description: { type: "string", example: "A modern smartphone" },
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
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
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
          "404": { $ref: "#/components/responses/NotFound" },
          "409": {
            description: "Product already exists in wishlist.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
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
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
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
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
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
              schema: { $ref: "#/components/schemas/UpdateCartQuantityRequest" },
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
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
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
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
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
