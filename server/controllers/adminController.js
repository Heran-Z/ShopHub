
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// GET ADMIN DASHBOARD STATISTICS
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      deliveredOrders,
      shippedOrders,
      cancelledOrders,
      totalRevenueResult,
      recentOrders,
      lowStockProducts,
      revenueByCategory,
      ordersByDay,
    ] = await Promise.all([

      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Delivered" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Cancelled" }),

      // Total revenue (exclude cancelled)
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // 5 most recent orders with customer info
      Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Products with stock ≤ 5
      Product.find({ stockQuantity: { $lte: 5 } })
        .sort({ stockQuantity: 1 })
        .limit(8)
        .select("name category stockQuantity image")
        .lean(),

      // Revenue grouped by product category
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$productInfo.category",
            revenue: {
              $sum: { $multiply: ["$items.price", "$items.quantity"] },
            },
            unitsSold: { $sum: "$items.quantity" },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 6 },
      ]),

      // Orders per day for the last 7 days
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        pendingOrders,
        deliveredOrders,
        shippedOrders,
        cancelledOrders,
        totalRevenue,
      },
      recentOrders,
      lowStockProducts,
      revenueByCategory,
      ordersByDay,
    });

  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve dashboard statistics.",
    });
  }
};
