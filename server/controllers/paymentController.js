
import crypto from "crypto";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

// @desc    Process a simulated payment
// @route   POST /api/payments
// @access  Private
export const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, simulateResult } = req.body;

    // 1. Validate required fields
    if (!orderId || !paymentMethod) {
      return res.status(400).json({
        message: "Order ID and payment method are required.",
      });
    }

    const allowedMethods = [
      "Cash on Delivery",
      "Telebirr",
      "CBE Birr",
    ];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method.",
      });
    }

    // 2. Find the order and verify ownership
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // 3. Prevent paying for an already-paid order
    const existingSuccessfulPayment = await Payment.findOne({
      order: order._id,
      paymentStatus: "Successful",
    });

    if (existingSuccessfulPayment) {
      return res.status(400).json({
        message: "This order has already been paid.",
      });
    }

    // 4. Validate simulation result
    // This is for development/testing only.
    const result = simulateResult || "success";

    if (!["success", "failure"].includes(result)) {
      return res.status(400).json({
        message: "Invalid simulated payment result.",
      });
    }

    // 5. Cash on Delivery remains pending until delivery/payment
    const isCOD = paymentMethod === "Cash on Delivery";

    const paymentStatus = isCOD
      ? "Pending"
      : result === "success"
        ? "Successful"
        : "Failed";

    // 6. Create payment record using the order's actual total
    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: order.totalAmount,
      paymentMethod,
      paymentStatus,
      transactionId: crypto.randomUUID(),
      failureReason:
        paymentStatus === "Failed"
          ? "Simulated payment failure."
          : "",
      paidAt:
        paymentStatus === "Successful"
          ? new Date()
          : null,
    });

    // 7. Update the order's embedded payment snapshot
    await Order.findByIdAndUpdate(order._id, {
      $set: {
        "payment.method": paymentMethod,
        "payment.status":
          paymentStatus === "Successful"
            ? "Paid"
            : paymentStatus === "Failed"
              ? "Failed"
              : "Pending",
        "payment.transactionId": payment.transactionId,
        "payment.paidAt": payment.paidAt,
      },
    });

    // 8. Send response
    return res.status(201).json({
      success: true,
      message:
        paymentStatus === "Successful"
          ? "Payment successful!"
          : paymentStatus === "Pending"
            ? "Cash on Delivery selected. Payment is pending."
            : "Payment failed. Please try again.",
      payment,
      paymentStatus,
    });
  } catch (error) {
    console.error("Payment error:", error);

    return res.status(500).json({
      message: "Server error while processing payment.",
      error: error.message,
    });
  }
};

// @desc    Get logged-in user's payments
// @route   GET /api/payments/my-payments
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user._id,
    })
      .populate("order", "totalAmount status createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    return res.status(500).json({
      message: "Server error while fetching payments.",
      error: error.message,
    });
  }
};
