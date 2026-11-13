/**
 * ShopHub — Product Seed Script
 *
 * Usage:
 *   node seed.js          → clears existing products and inserts all seeds
 *   node seed.js --append → keeps existing products and only inserts new ones
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  // ── ELECTRONICS ──────────────────────────────────────────────
  {
    name: "Samsung Galaxy S24 Ultra",
    description:
      "The flagship Samsung smartphone featuring a 200MP camera, Snapdragon 8 Gen 3 processor, 5000mAh battery, and built-in S Pen. Perfect for photography, gaming, and productivity.",
    price: 54999,
    category: "Electronics",
    stockQuantity: 25,
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&q=80",
  },
  {
    name: "Apple iPhone 15 Pro",
    description:
      "Apple's most powerful iPhone with a titanium frame, A17 Pro chip, 48MP triple camera system, and USB-C connectivity. Experience the future of mobile.",
    price: 64999,
    category: "Electronics",
    stockQuantity: 18,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&q=80",
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise cancelling wireless headphones with 30-hour battery life, multipoint connection, and crystal-clear hands-free calling.",
    price: 18999,
    category: "Electronics",
    stockQuantity: 40,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80",
  },
  {
    name: "Apple Watch Series 9",
    description:
      "The most advanced Apple Watch with a brighter Always-On display, the new S9 chip, Double Tap gesture, and advanced health sensors including ECG and blood oxygen.",
    price: 29999,
    category: "Electronics",
    stockQuantity: 30,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700&q=80",
  },
  {
    name: "MacBook Air M3",
    description:
      "Supercharged by the Apple M3 chip, the new MacBook Air is faster than ever. Incredibly thin and light with an 18-hour battery and a stunning Liquid Retina display.",
    price: 89999,
    category: "Electronics",
    stockQuantity: 12,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80",
  },
  {
    name: "iPad Pro 12.9-inch",
    description:
      "The ultimate iPad experience with the M2 chip, ProMotion XDR display, Thunderbolt connectivity, and support for Apple Pencil and Magic Keyboard.",
    price: 74999,
    category: "Electronics",
    stockQuantity: 20,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&q=80",
  },
  {
    name: "DJI Mini 4 Pro Drone",
    description:
      "Lightweight foldable drone with 4K HDR video, omnidirectional obstacle sensing, 34-minute flight time, and 20km transmission range. Perfect for content creators.",
    price: 39999,
    category: "Electronics",
    stockQuantity: 15,
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=700&q=80",
  },

  // ── FASHION ──────────────────────────────────────────────────
  {
    name: "Nike Air Max 270",
    description:
      "Inspired by two of Nike's most iconic Air Max shoes, the Air Max 270 delivers a fresh mix of comfort and bold style with the tallest Air unit ever made.",
    price: 8999,
    category: "Fashion",
    stockQuantity: 50,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80",
  },
  {
    name: "Levi's 501 Original Jeans",
    description:
      "The original blue jeans since 1873. The 501 is a cultural icon with a straight leg, button fly, and timeless fit that works for every occasion.",
    price: 5499,
    category: "Fashion",
    stockQuantity: 60,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=80",
  },
  {
    name: "Adidas Ultraboost 23",
    description:
      "The legendary running shoe with an 11/10 energy return Boost midsole, Primeknit+ upper, and Continental rubber outsole for grip on any surface.",
    price: 11999,
    category: "Fashion",
    stockQuantity: 35,
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&q=80",
  },
  {
    name: "Leather Crossbody Bag",
    description:
      "Premium full-grain leather crossbody bag with adjustable strap, multiple compartments, and gold-tone hardware. The perfect everyday companion for work or weekends.",
    price: 7499,
    category: "Fashion",
    stockQuantity: 28,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80",
  },
  {
    name: "Classic Aviator Sunglasses",
    description:
      "Timeless Ray-Ban inspired aviator sunglasses with UV400 protection, metal frame, and gradient lenses. A style staple that never goes out of fashion.",
    price: 3999,
    category: "Fashion",
    stockQuantity: 55,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&q=80",
  },

  // ── HOME & LIVING ─────────────────────────────────────────────
  {
    name: "Nespresso Vertuo Pop Coffee Machine",
    description:
      "Brew barista-quality coffee at home with Centrifusion technology. Compatible with all Vertuo capsules for espresso, double espresso, gran lungo, mug, and alto sizes.",
    price: 12999,
    category: "Home & Living",
    stockQuantity: 22,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80",
  },
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    description:
      "The most powerful Dyson cordless vacuum with laser dust detection, piezo sensor, LCD screen, and 60-minute runtime on a full charge.",
    price: 34999,
    category: "Home & Living",
    stockQuantity: 10,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
  },
  {
    name: "Scandinavian Table Lamp",
    description:
      "Minimalist Scandinavian design table lamp with adjustable brightness, warm white LED, and a marble base. Adds elegance to any bedroom or living room.",
    price: 4499,
    category: "Home & Living",
    stockQuantity: 45,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&q=80",
  },
  {
    name: "Luxury Scented Candle Set",
    description:
      "Set of 3 hand-poured soy wax candles in premium glass jars. Scents include vanilla latte, cedarwood & sage, and fresh linen. Each burns for 50+ hours.",
    price: 2199,
    category: "Home & Living",
    stockQuantity: 70,
    image:
      "https://images.unsplash.com/photo-1602874801006-8899e1b32f99?w=700&q=80",
  },

  // ── SPORTS & FITNESS ─────────────────────────────────────────
  {
    name: "Gymshark Vital Seamless Set",
    description:
      "High-performance seamless activewear set including sports bra and leggings. Moisture-wicking, four-way stretch fabric keeps you comfortable through any workout.",
    price: 6999,
    category: "Sports",
    stockQuantity: 48,
    image:
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=700&q=80",
  },
  {
    name: "Adjustable Dumbbell Set 5–52.5 lbs",
    description:
      "Replace 15 sets of weights with one compact solution. Adjust from 5 to 52.5 lbs in 2.5-lb increments. Durable, space-saving home gym essential.",
    price: 24999,
    category: "Sports",
    stockQuantity: 18,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80",
  },
  {
    name: "Hydro Flask 32 oz Water Bottle",
    description:
      "TempShield double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12. Durable, BPA-free stainless steel in a range of bold colours.",
    price: 2799,
    category: "Sports",
    stockQuantity: 90,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&q=80",
  },

  // ── BEAUTY & PERSONAL CARE ────────────────────────────────────
  {
    name: "Dyson Airwrap Multi-Styler",
    description:
      "The Dyson Airwrap styles and dries simultaneously without extreme heat. Comes with six attachments for curls, waves, smoothing, and volumising.",
    price: 32999,
    category: "Beauty",
    stockQuantity: 14,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80",
  },
  {
    name: "Luxury Skincare Gift Set",
    description:
      "Curated set including vitamin C serum, hyaluronic acid moisturiser, retinol eye cream, and SPF 50 sunscreen. All dermatologist-tested and cruelty-free.",
    price: 8499,
    category: "Beauty",
    stockQuantity: 32,
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=700&q=80",
  },
];

async function seed() {
  const isAppend = process.argv.includes("--append");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    if (!isAppend) {
      const deleted = await Product.deleteMany({});
      console.log(`🗑  Cleared ${deleted.deletedCount} existing products`);
    }

    const inserted = await Product.insertMany(products);
    console.log(`🌱 Seeded ${inserted.length} products successfully`);

    console.log("\nCategories added:");
    const cats = [...new Set(products.map((p) => p.category))];
    cats.forEach((c) => {
      const count = products.filter((p) => p.category === c).length;
      console.log(`  • ${c}: ${count} products`);
    });
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

seed();
