import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { mockDeviceProps } from "__mocks__/src/components/Device";

// Mocks for react-query hooks and Device component
vi.mock("@tanstack/react-query", () => ({
  useIsFetching: vi.fn(() => 0),
  useIsMutating: vi.fn(() => 0),
}));
vi.mock("src/services/mutations", () => ({
  useDeleteDevice: vi.fn(() => ({ mutate: vi.fn() })),
  useUpdateDevice: vi.fn(() => ({ mutate: vi.fn() })),
}));

// Mock Device to expose props for testing
vi.mock("src/components/Device", () =>
  import("__mocks__/src/components/Device")
);

import * as reactQuery from "@tanstack/react-query";
import DeviceGroup from "src/components/DeviceGroup";

describe("DeviceGroup component", () => {
  const devices = [
    {
      id: "1",
      name: "Heater",
      type: "water_heater",
      room: "Bath",
      status: "on",
      parameters: {},
    },
    {
      id: "2",
      name: "Lamp",
      type: "light",
      room: "Living",
      status: "off",
      parameters: {},
    },
  ];

  beforeEach(() => {
    for (const key in mockDeviceProps) {
      delete mockDeviceProps[key];
    }
    vi.clearAllMocks();
  });

  it("renders the group label", () => {
    render(<DeviceGroup label="Test Group" deviceList={[]} />);
    expect(screen.getByText("Test Group:")).toBeInTheDocument();
  });
  it("renders one Device component per device in the list", () => {
    render(<DeviceGroup lable="Test Group" deviceList={devices} />);
    const deviceElements = screen.getAllByTestId("mock-device");
    expect(deviceElements).toHaveLength(devices.length);
  });
  it("disables devices when fetching or mutating", () => {
    vi.spyOn(reactQuery, "useIsFetching").mockReturnValue(1);
    vi.spyOn(reactQuery, "useIsMutating").mockReturnValue(0);

    render(<DeviceGroup label="Disabled Group" deviceList={devices} />);

    for (const device of Object.values(mockDeviceProps)) {
      expect(device.disabled).toBe(true);
    }
  });

  it("does not disable devices when not fetching or mutating", () => {
    vi.spyOn(reactQuery, "useIsFetching").mockReturnValue(0);
    vi.spyOn(reactQuery, "useIsMutating").mockReturnValue(0);

    render(<DeviceGroup label="Enabled Group" deviceList={devices} />);

    for (const device of Object.values(mockDeviceProps)) {
      expect(device.disabled).toBe(false);
    }
  });
});
