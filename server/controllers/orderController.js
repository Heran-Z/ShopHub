
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { items, delivery, paymentMethod } = req.body;

    // Validate cart
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // Validate delivery information
    if (
      !delivery?.fullName?.trim() ||
      !delivery?.phone?.trim() ||
      !delivery?.address?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete delivery information.",
      });
    }

    // Validate payment method
    const allowedPaymentMethods = [
      "Cash on Delivery",
      "Telebirr",
      "CBE Birr",
    ];

    const selectedPaymentMethod =
      paymentMethod && allowedPaymentMethods.includes(paymentMethod)
        ? paymentMethod
        : "Cash on Delivery";

    // Validate product IDs and quantities
    const quantities = new Map();

    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.product) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product or quantity.",
        });
      }

      const productId = item.product.toString();

      quantities.set(
        productId,
        (quantities.get(productId) || 0) +
          Number(item.quantity)
      );
    }

    let createdOrder;

    // Start database transaction
    await session.withTransaction(async () => {
      const orderItems = [];
      let totalAmount = 0;

      for (const [productId, quantity] of quantities) {
        // Find product
        const product = await Product.findById(
          productId
        ).session(session);

        if (!product) {
          throw new Error("A requested product was not found.");
        }

        // Check stock
        if (product.stockQuantity < quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}.`
          );
        }

        // Calculate price using database value
        const itemPrice = product.price;

        orderItems.push({
          product: product._id,
          quantity,
          price: itemPrice,
        });

        totalAmount += itemPrice * quantity;

        // Reduce stock
        product.stockQuantity -= quantity;

        await product.save({ session });
      }

      // Create order
      const order = new Order({
        user: req.user._id,

        items: orderItems,

        delivery: {
          fullName: delivery.fullName.trim(),
          phone: delivery.phone.trim(),
          address: delivery.address.trim(),
        },

        totalAmount,

        payment: {
          method: selectedPaymentMethod,
          status: "Pending",
        },

        status: "Pending",
      });

      await order.save({ session });

      createdOrder = order;
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: createdOrder,
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to place order.",
    });

  } finally {
    await session.endSession();
  }
};


// GET LOGGED-IN CUSTOMER'S ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your orders.",
    });
  }
};

// ADMIN: GET ALL CUSTOMER ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve orders.",
    });
  }
};


// ADMIN: UPDATE ORDER STATUS

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    // Update only the status field.
    // This avoids validating missing delivery fields
    // on older orders.
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      order,
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
