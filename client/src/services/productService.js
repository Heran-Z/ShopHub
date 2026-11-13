
import api from "./api";

// Fetch all products
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Fetch one product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Convert uploaded image paths into browser-accessible URLs
export const getProductImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  const serverUrl = api.defaults.baseURL.replace(/\/api\/?$/, "");

  return `${serverUrl}${image.startsWith("/") ? "" : "/"}${image}`;
};
