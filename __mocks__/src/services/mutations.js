import { vi } from "vitest";

const mockMutation = (result = {}) => ({
  mutate: vi.fn(),
  isLoading: false,
  isError: false,
  data: result,
  error: null,
});

export const useCreateDevice = vi.fn(() => mockMutation());
export const useUpdateDevice = vi.fn(() => mockMutation());
export const useDeleteDevice = vi.fn(() => mockMutation());
export const useDeviceAction = vi.fn(() => mockMutation());
