import axios from "axios";

const axiosInstance = axios.create({
    // In production the frontend and backend are behind the same ALB.
    // Keeping the API URL relative avoids hard-coding an old EC2 address.
    baseURL: process.env.REACT_APP_API_URL || "/",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
