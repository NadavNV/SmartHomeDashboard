import { vi } from "vitest";

const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

const axiosMock = {
  create: vi.fn(() => mockAxiosInstance),
};

export default axiosMock;
export { mockAxiosInstance };
