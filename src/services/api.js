import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

// Automatically include token if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = async (username, password) => {
  return (await axiosInstance.post("/login", { username, password })).data;
};

export const registerUser = async (username, password) => {
  return (await axiosInstance.post("/register", { username, password })).data;
};

export const getDeviceIds = async () => {
  return (await axiosInstance.get("/api/ids")).data;
};

export const getDevice = async (id) => {
  return (await axiosInstance.get(`/api/devices/${id}`)).data;
};

export const createDevice = async (device) => {
  await axiosInstance.post("/api/devices", device);
};

export const updateDevice = async (update) => {
  await axiosInstance.put(`/api/devices/${update.id}`, update.changes);
};

export const deleteDevice = async (id) => {
  await axiosInstance.delete(`/api/devices/${id}`);
};
