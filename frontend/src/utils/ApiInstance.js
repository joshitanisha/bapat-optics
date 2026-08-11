import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("bapat_optics_admin_security");

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = Cookies.get("bapat_optics_admin_security");

      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      } else {
        config.headers["Authorization"] = "";
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosClient;
