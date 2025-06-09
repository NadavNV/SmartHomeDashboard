import axios from "axios";

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const getDevices = async () => {
  return (await axiosInstance.get("api/devices")).data;
};

export const createDevice = async (device) => {
  await axiosInstance.post("api/devices", device);
};

export const updateDevice = async (device) => {
  await axiosInstance.put(`api/devices/${device.id}`, device);
};

export const deviceAction = async (device) => {
  await axiosInstance.post(`api/devices/${device.id}/action`, device);
};

export const deleteDevice = async (id) => {
  await axiosInstance.delete(`api/devices/${id}`);
};
