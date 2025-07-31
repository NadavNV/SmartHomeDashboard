import { vi } from "vitest";
// === Mock external dependencies ===
vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  const axiosMock = {
    create: vi.fn(() => mockAxiosInstance),
  };

  return {
    default: axiosMock,
    __mockInstance: mockAxiosInstance,
  };
});
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import DeviceList from "src/components/DeviceList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { __mockInstance as mockAxiosInstance } from "axios";

// Use fake timers globally
vi.useFakeTimers();

// === Setup mock data ===
const mockDeviceIds = ["device-1", "device-2"];
const mockDevices = [
  {
    id: "device-1",
    name: "Kitchen Light",
    type: "light",
    room: "kitchen",
    status: "on",
    parameters: {
      is_dimmable: true,
      brightness: 75,
      dynamic_color: false,
    },
  },
  {
    id: "device-2",
    name: "Main Water Heater",
    type: "water_heater",
    room: "bathroom",
    status: "off",
    parameters: {
      temperature: 23,
      target_temperature: 55,
      is_heating: false,
      timer_enabled: true,
      scheduled_on: "06:30",
      scheduled_off: "06:45",
    },
  },
];

mockAxiosInstance.get.mockImplementation((url) => {
  if (url === "/api/ids") {
    return Promise.resolve({ status: 200, data: mockDeviceIds });
  } else if (/^\/api\/devices\/[^/]+$/.test(url)) {
    const id = url.split("/").pop();
    const device = mockDevices.find((d) => d.id === id);
    if (device) {
      return Promise.resolve({ status: 200, data: device });
    } else {
      return Promise.reject({
        response: { status: 404, data: { error: "Not found" } },
      });
    }
  }
  return Promise.reject(new Error(`Unexpected GET url: ${url}`));
});

mockAxiosInstance.post.mockResolvedValue({
  status: 200,
  data: { message: "Created" },
});
mockAxiosInstance.put.mockResolvedValue({
  status: 200,
  data: { message: "Updated" },
});
mockAxiosInstance.delete.mockResolvedValue({
  status: 200,
  data: { message: "Deleted" },
});

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0, // no caching
        staleTime: 0, // treat as stale immediately
      },
    },
  }); // fresh client for each test
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("Unit test DeviceList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("loads devices from the database automatically", async () => {
    renderWithQueryClient(<DeviceList />);

    await waitFor(() => {
      expect(screen.queryByText("Kitchen Light")).toBeInTheDocument();
      expect(screen.queryByText("Main Water Heater")).toBeInTheDocument();
    });

    const expectedCalls = [
      "/api/ids",
      "/api/devices/device-1",
      "/api/devices/device-2",
    ];
    const getCalls = mockAxiosInstance.get.mock.calls.map((call) => call[0]);

    expect(getCalls).toEqual(expect.arrayContaining(expectedCalls));
  });
});
