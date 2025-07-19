import { vi } from "vitest";
// === Mock external dependencies ===
vi.mock("src/services/queries");
vi.mock("src/services/mutations");
vi.mock("src/components/NewDeviceForm");
vi.mock("src/components/DeviceGroup");
vi.mock("@tanstack/react-query", () => ({
  useIsFetching: vi.fn(),
  useIsMutating: vi.fn(),
  useQueryClient: vi.fn(),
}));
import { render, screen, fireEvent, act } from "@testing-library/react";
import DeviceList from "src/components/DeviceList";
import { useDeviceIds, useDevices } from "src/services/queries";
import { useCreateDevice } from "src/services/mutations";
import {
  useIsFetching,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";

// Use fake timers globally
vi.useFakeTimers();

// === Setup mock data ===
const mockDeviceIds = ["device-1", "device-2"];
const mockDevices = [
  {
    id: "device-1",
    type: "light",
    room: "kitchen",
  },
  {
    id: "device-2",
    type: "water_heater",
    room: "bathroom",
  },
];

const mockInvalidateQueries = vi.fn().mockImplementation(async (...args) => {
  console.log("invalidateQueries called with", args);
  return Promise.resolve();
});

beforeEach(() => {
  vi.clearAllMocks();
  useQueryClient.mockReturnValue({
    invalidateQueries: mockInvalidateQueries,
  });
  useCreateDevice.mockReturnValue({ mutate: vi.fn() });
  useIsFetching.mockReturnValue(0);
  useIsMutating.mockReturnValue(0);
});

it("shows loading when fetching", () => {
  useDeviceIds.mockReturnValue({ data: mockDeviceIds, isError: false });
  useDevices.mockReturnValue({ data: mockDevices, isError: false });
  useIsFetching.mockReturnValue(1);
  useIsMutating.mockReturnValue(0);

  render(<DeviceList />);
  expect(screen.getByText(/Loading/)).toBeInTheDocument();
});

it("shows data and allows adding a device", () => {
  useDeviceIds.mockReturnValue({ data: mockDeviceIds, isError: false });
  useDevices.mockReturnValue({ data: mockDevices, isError: false });

  render(<DeviceList />);
  expect(screen.getByText(/Data retrieved at/)).toBeInTheDocument();
  expect(screen.getAllByTestId("mock-device-group")).toHaveLength(2);

  fireEvent.click(screen.getByText("Add device"));
  expect(screen.getByTestId("mock-new-device-form")).toBeInTheDocument();
});

test("reload button invalidates device queries", async () => {
  useDeviceIds.mockReturnValue({ data: mockDeviceIds, isError: false });
  useDevices.mockReturnValue({ data: mockDevices, isError: false });

  render(<DeviceList />);

  fireEvent.click(screen.getByText("Reload"));

  // Flush immediate async operations, not long-running timers
  await act(async () => {
    vi.advanceTimersByTime(0);
    await Promise.resolve();
  });

  expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);

  const calls = mockInvalidateQueries.mock.calls.map(([arg]) => arg.queryKey);
  expect(calls).toContainEqual(["device_ids"]);
  expect(calls).toContainEqual(["device"]);
});

test("auto reload triggers after 60 seconds of no user activity", async () => {
  useDeviceIds.mockReturnValue({ data: mockDeviceIds, isError: false });
  useDevices.mockReturnValue({ data: mockDevices, isError: false });

  render(<DeviceList />);

  // Advance fake timers by 60 seconds
  await act(async () => {
    await vi.advanceTimersByTimeAsync(60000);
  });

  expect(mockInvalidateQueries).toHaveBeenCalledTimes(2);

  const calls = mockInvalidateQueries.mock.calls.map(([arg]) => arg.queryKey);
  expect(calls).toContainEqual(["device_ids"]);
  expect(calls).toContainEqual(["device"]);
});
