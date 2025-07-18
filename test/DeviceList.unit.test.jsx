import { render, screen, fireEvent, act } from "@testing-library/react";
import DeviceList from "../src/DeviceList";
import { useDeviceIds, useDevices } from "../services/queries";
import { useCreateDevice } from "../services/mutations";
import {
  useIsFetching,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";

// Use fake timers globally
jest.useFakeTimers();

// === Mock external dependencies ===
jest.mock("../services/queries", () => ({
  useDeviceIds: jest.fn(),
  useDevices: jest.fn(),
}));

jest.mock("../services/mutations", () => ({
  useCreateDevice: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useIsFetching: jest.fn(),
  useIsMutating: jest.fn(),
  useQueryClient: jest.fn(),
}));

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

const mockInvalidateQueries = jest.fn();

beforeEach(() => {
  useQueryClient.mockReturnValue({
    invalidateQueries: mockInvalidateQueries,
  });
  useCreateDevice.mockReturnValue({ mutate: jest.fn() });
  jest.clearAllMocks();
});

test("shows loading when fetching", () => {
  useDeviceIds.mockReturnValue({ data: mockDeviceIds, isError: false });
  useDevices.mockReturnValue({ data: mockDevices, isError: false });
  useIsFetching.mockReturnValue(1);
  useIsMutating.mockReturnValue(0);

  render(<DeviceList />);
  expect(screen.getByText(/Loading/)).toBeInTheDocument();
});

test("shows data and allows adding a device", () => {
  useDeviceIds.mockReturnValue({ data: mockDeviceIds, isError: false });
  useDevices.mockReturnValue({ data: mockDevices, isError: false });
  useIsFetching.mockReturnValue(0);
  useIsMutating.mockReturnValue(0);

  render(<DeviceList />);
  expect(screen.getByText(/Data retrieved at/)).toBeInTheDocument();

  fireEvent.click(screen.getByText("Add device"));
  expect(screen.getByText("Add Device")).toBeInTheDocument(); // Assuming form has a header
});

test("reload button invalidates device queries", async () => {
  useDeviceIds.mockReturnValue({ data: mockDeviceIds, isError: false });
  useDevices.mockReturnValue({ data: mockDevices, isError: false });
  useIsFetching.mockReturnValue(0);
  useIsMutating.mockReturnValue(0);

  render(<DeviceList />);
  fireEvent.click(screen.getByText("Reload"));
  expect(mockInvalidateQueries).toHaveBeenCalledWith({
    queryKey: ["device_ids"],
  });
  expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["device"] });
});

test("auto reload triggers after 60 seconds of no user activity", () => {
  useDeviceIds.mockReturnValue({ data: mockDeviceIds, isError: false });
  useDevices.mockReturnValue({ data: mockDevices, isError: false });
  useIsFetching.mockReturnValue(0);
  useIsMutating.mockReturnValue(0);

  render(<DeviceList />);

  // Advance fake timers by 60 seconds
  act(() => {
    jest.advanceTimersByTime(60000);
  });

  expect(mockInvalidateQueries).toHaveBeenCalledWith({
    queryKey: ["device_ids"],
  });
  expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["device"] });
});
