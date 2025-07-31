import { vi } from "vitest";
// === Mock external dependencies ===
global.alert = vi.fn();
vi.mock("axios");
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  within,
} from "@testing-library/react";
import DeviceList from "src/components/DeviceList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mockAxiosInstance } from "axios";

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
      return Promise.resolve({ status: 200, data: { ...device } });
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
    await act(async () => {
      renderWithQueryClient(<DeviceList />);
    });
    await waitFor(() => {
      const calls = mockAxiosInstance.get.mock.calls.map((args) => args[0]);
      expect(calls).toContain("/api/ids");
    });
    await waitFor(() => {
      const calls = mockAxiosInstance.get.mock.calls.map((args) => args[0]);
      expect(calls).toContain("/api/devices/device-1");
      expect(calls).toContain("/api/devices/device-2");
    });

    await waitFor(() => {
      expect(screen.queryByText(/Kitchen Light/i)).toBeInTheDocument();
      expect(screen.queryByText(/Main Water Heater/i)).toBeInTheDocument();
    });
  });
  test("new device form clears on successful device creation", async () => {
    await act(async () => {
      renderWithQueryClient(<DeviceList />);
    });
    await waitFor(() => {
      const calls = mockAxiosInstance.get.mock.calls.map((args) => args[0]);
      expect(calls).toContain("/api/ids");
    });
    await waitFor(() => {
      const calls = mockAxiosInstance.get.mock.calls.map((args) => args[0]);
      expect(calls).toContain("/api/devices/device-1");
      expect(calls).toContain("/api/devices/device-2");
    });

    await waitFor(() => {
      expect(screen.queryByText(/Kitchen Light/i)).toBeInTheDocument();
      expect(screen.queryByText(/Main Water Heater/i)).toBeInTheDocument();
    });
    await act(async () => {
      fireEvent.click(screen.getByLabelText(/Show add device form button/));
    });

    const withinForm = within(screen.getByLabelText(/new device form/i));
    await act(async () => {
      fireEvent.click(
        withinForm.getByRole("button", { name: /edit device id/i })
      );
    });
    await act(async () => {
      fireEvent.change(
        withinForm.getByRole("textbox", { name: /device id/i }),
        {
          target: { value: "device-1" },
        }
      );
    });
    await act(async () => {
      fireEvent.click(
        withinForm.getByRole("button", { name: /save device id/i })
      );
    });
    await act(async () => {
      fireEvent.click(withinForm.getByRole("button", { name: /submit/i }));
    });
    expect(global.alert).toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(
        withinForm.getByRole("button", { name: /edit device id/i })
      );
    });
    await act(async () => {
      fireEvent.change(
        withinForm.getByRole("textbox", { name: /device id/i }),
        {
          target: { value: "device-3" },
        }
      );
    });
    await act(async () => {
      fireEvent.click(
        withinForm.getByRole("button", { name: /save device id/i })
      );
    });
    await act(async () => {
      fireEvent.click(
        withinForm.getByRole("button", { name: /edit device name/i })
      );
    });
    await act(async () => {
      fireEvent.change(
        withinForm.getByRole("textbox", { name: /device name/i }),
        {
          target: { value: "Steve" },
        }
      );
    });
    await act(async () => {
      fireEvent.click(
        withinForm.getByRole("button", { name: /save device name/i })
      );
    });
    await act(async () => {
      fireEvent.click(withinForm.getByRole("button", { name: /edit room/i }));
    });
    await act(async () => {
      fireEvent.change(withinForm.getByRole("textbox", { name: /room/i }), {
        target: { value: "device-1" },
      });
    });
    await act(async () => {
      fireEvent.click(withinForm.getByRole("button", { name: /save room/i }));
    });
    await act(async () => {
      fireEvent.change(withinForm.getByRole("combobox", { name: /type/i }), {
        target: { value: "light" },
      });
    });
    await act(async () => {
      fireEvent.click(withinForm.getByRole("button", { name: /submit/i }));
    });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith("/api/devices", {
      id: "device-3",
      name: "Steve",
      parameters: {
        dynamic_color: false,
        is_dimmable: false,
      },
      room: "device-1",
      status: "off",
      type: "light",
    });
    expect(
      screen.queryByLabelText(/^new device form/i)
    ).not.toBeInTheDocument();
  });
  test("devices are grouped correctly and the group by button works", async () => {
    await act(async () => {
      renderWithQueryClient(<DeviceList />);
    });
    await waitFor(() => {
      expect(screen.queryByText(/Kitchen Light/i)).toBeInTheDocument();
      expect(screen.queryByText(/Main Water Heater/i)).toBeInTheDocument();
    });
    const withinLightGroup = within(
      screen
        .getAllByRole("listitem")
        .find((el) => el.textContent.includes("Light"))
    );
    expect(withinLightGroup.getByText(/Kitchen Light/i)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /group by room/i }));
    });
    const withinKitchenGroup = within(
      screen
        .getAllByRole("listitem")
        .find((el) => el.textContent.includes("Kitchen"))
    );
    expect(withinKitchenGroup.getByText(/Kitchen Light/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /group by room/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /group by type/i })
    ).toBeInTheDocument();
  });
});
