import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_WEBHOOK_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
