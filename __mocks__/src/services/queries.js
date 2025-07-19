import { vi } from "vitest";

export const useDevices = vi.fn((ids) => {
  return {
    data: ids.map((id) => ({ id, name: `Mocked Device ${id}` })),
    isPending: false,
    isError: false,
    errors: [],
  };
});

export const useDeviceIds = vi.fn(() => ({
  data: ["id1", "id2"],
  isPending: false,
  isError: false,
  error: null,
}));
