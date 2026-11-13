
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    delivery: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    payment: {
      method: {
        type: String,
        enum: ["Telebirr", "CBE Birr", "Cash on Delivery"],
        required: true,
        default: "Cash on Delivery",
      },

      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },

      transactionId: {
        type: String,
        default: null,
      },

      paidAt: {
        type: Date,
        default: null,
      },

      simulateResult: {
        type: String,
        enum: ["success", "failure"],
        default: "success",
      },
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
