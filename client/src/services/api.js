
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // It will now ask Vercel, and Vercel will forward it to Render
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;