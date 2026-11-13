
import { useEffect, useState } from "react";
import api from "../services/api";

function BackendStatus() {
  const [status, setStatus] = useState("Checking connection...");

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
}

export default BackendStatus;
