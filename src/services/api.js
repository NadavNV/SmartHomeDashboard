import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

export const getDeviceIds = async () => {
  const response = await axiosInstance.get("/api/ids");
  console.log(`get("/api/ids") returned ${response}`);
  console.log(`response data is ${response.data}`);
  return response.data;
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
