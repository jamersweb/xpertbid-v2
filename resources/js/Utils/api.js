import axios from 'axios';

// In the monolithic app, we can use the relative path or the app URL
const API_BASE_URL = ""; // Relative path

const axiosInstance = axios.create({
       baseURL: API_BASE_URL,
       headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
       },
});

export default axiosInstance;
export { API_BASE_URL };
