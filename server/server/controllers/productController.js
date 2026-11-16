
import Product from "../models/Product.js";

// CREATE PRODUCT (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stockQuantity,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stockQuantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields.",
      });
    }

    // Get uploaded image path
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a product image.",
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stockQuantity: Number(stockQuantity),
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};


// GET ALL PRODUCTS (Customers and Admin)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};


// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
    });
  }
};


// UPDATE PRODUCT (Admin)
export const updateProduct = async (req, res) => {
  try {
    const updates = {
      ...req.body,
    };

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    if (updates.stockQuantity !== undefined) {
      updates.stockQuantity = Number(updates.stockQuantity);
    }

    // Update image if a new one was uploaded
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};


// DELETE PRODUCT (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
