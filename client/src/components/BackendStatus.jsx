
import { useEffect, useState } from "react";
import api from "../services/api";

function BackendStatus() {
  const [status, setStatus] = useState("Checking connection...");
<<<<<<< HEAD
/*
=======

>>>>>>> f737b43b4ee424e827a9bd2dc9ed02f8721497d1
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/health");

        if (response.data.success) {
          setStatus("Connected successfully!");
        }
      } catch (error) {
        console.error("Backend connection failed:", error);
        setStatus("Connection failed. Check your backend.");
      }
    };

    checkBackend();
  }, []);

  return (
    <div style={{
      padding: "10px",
      textAlign: "center",
      background: "#e8f5e9",
      color: "#166534"
    }}>
      Backend: {status}
    </div>
  );
<<<<<<< HEAD
  */
=======
>>>>>>> f737b43b4ee424e827a9bd2dc9ed02f8721497d1
}

export default BackendStatus;
