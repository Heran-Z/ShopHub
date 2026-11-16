
import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "/api", // It will now ask Vercel, and Vercel will forward it to Render
=======
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
>>>>>>> f737b43b4ee424e827a9bd2dc9ed02f8721497d1
  headers: {
    "Content-Type": "application/json",
  },
});

<<<<<<< HEAD
export default api;
=======
export default api;
>>>>>>> f737b43b4ee424e827a9bd2dc9ed02f8721497d1
