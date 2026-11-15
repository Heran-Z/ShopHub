
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Telebirr", "CBE Birr"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Successful", "Failed"],
      default: "Pending",
    },

    transactionId: {
      type: String,
      unique: true,
      required: true,
    },

    failureReason: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
