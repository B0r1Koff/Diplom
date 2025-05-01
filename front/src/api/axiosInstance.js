import axios from "axios";

export const axiosInstance = (token) =>
    axios.create({
      baseURL: "http://127.0.0.1:8090/api/",
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });