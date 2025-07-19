import { vi } from "vitest";

export const getDeviceIds = vi.fn(() => Promise.resolve(["id1", "id2"]));
export const getDevice = vi.fn((id) =>
  Promise.resolve({ id, name: `Device ${id}`, type: "light" })
);
export const createDevice = vi.fn(() => Promise.resolve());
export const updateDevice = vi.fn(() => Promise.resolve());
export const deviceAction = vi.fn(() => Promise.resolve());
export const deleteDevice = vi.fn(() => Promise.resolve());
