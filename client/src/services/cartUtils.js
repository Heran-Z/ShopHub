/**
 * Cart utility — per-user cart isolation.
 *
 * The cart is stored in localStorage under a key that includes
 * the logged-in user's ID so that each customer only ever sees
 * their own items, even on a shared browser.
 *
 * Guest users (no userId) fall back to "shophub_cart_guest".
 */

const guestKey = "shophub_cart_guest";

export const getCartKey = (userId) =>
  userId ? `shophub_cart_${userId}` : guestKey;

export const readCart = (userId) => {
  try {
    const raw = localStorage.getItem(getCartKey(userId));
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeCart = (userId, cart) => {
  localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const clearCart = (userId) => {
  localStorage.removeItem(getCartKey(userId));
  window.dispatchEvent(new Event("cartUpdated"));
};
