import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/admin",
});

export const adminLogin = (data) => API.post("/login", data);

export const getDashboard = (token) =>
  API.get("/dashboard", {
    headers: {
      Authorization: token,
    },
  });
