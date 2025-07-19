import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

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
vi.mock("src/components/Device", () => ({
  default: ({ id, disabled, updateDevice, removeDevice }) => (
    <div
      data-testid="device"
      data-id={id}
      data-disabled={disabled ? "true" : "false"}
      onClick={() => {
        // Mocked onClick handler for testing callbacks
        updateDevice && updateDevice({ id, changes: { test: true } });
        removeDevice && removeDevice(id);
      }}
    >
      Device {id}
    </div>
  ),
}));

import DeviceGroup from "src/components/DeviceGroup";
import * as reactQuery from "@tanstack/react-query";
import * as mutations from "src/services/mutations";

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
    vi.clearAllMocks();
  });

  it("renders the label and all devices", () => {
    render(<DeviceGroup label="Test Group" deviceList={devices} />);
    expect(screen.getByText("Test Group:")).toBeInTheDocument();

    const deviceElements = screen.getAllByTestId("device");
    expect(deviceElements).toHaveLength(devices.length);

    // Check device IDs are correct
    expect(deviceElements[0]).toHaveAttribute("data-id", "1");
    expect(deviceElements[1]).toHaveAttribute("data-id", "2");
  });

  it("disables devices when fetching or mutating", () => {
    vi.spyOn(reactQuery, "useIsFetching").mockReturnValue(1);
    vi.spyOn(reactQuery, "useIsMutating").mockReturnValue(0);

    render(<DeviceGroup label="Disabled Group" deviceList={devices} />);

    const deviceElements = screen.getAllByTestId("device");
    deviceElements.forEach((device) => {
      expect(device.getAttribute("data-disabled")).toBe("true");
    });
  });

  it("does not disable devices when not fetching or mutating", () => {
    vi.spyOn(reactQuery, "useIsFetching").mockReturnValue(0);
    vi.spyOn(reactQuery, "useIsMutating").mockReturnValue(0);

    render(<DeviceGroup label="Enabled Group" deviceList={devices} />);

    const deviceElements = screen.getAllByTestId("device");
    deviceElements.forEach((device) => {
      expect(device.getAttribute("data-disabled")).toBe("false");
    });
  });

  it("calls updateDeviceMutation.mutate when updateDevice callback is called", () => {
    const updateMutate = vi.fn();
    // Override the mocked useUpdateDevice to return mutate mock
    mutations.useUpdateDevice.mockImplementation(() => ({
      mutate: updateMutate,
    }));

    // useDeleteDevice can return default mock
    mutations.useDeleteDevice.mockImplementation(() => ({ mutate: vi.fn() }));

    render(<DeviceGroup label="Test" deviceList={[devices[0]]} />);

    fireEvent.click(screen.getByTestId("device"));

    expect(updateMutate).toHaveBeenCalledWith({
      id: "1",
      changes: { test: true },
    });
  });

  it("calls deleteDeviceMutation.mutate when removeDevice callback is called", () => {
    const deleteMutate = vi.fn();
    mutations.useDeleteDevice.mockImplementation(() => ({
      mutate: deleteMutate,
    }));
    mutations.useUpdateDevice.mockImplementation(() => ({ mutate: vi.fn() }));

    render(<DeviceGroup label="Test" deviceList={[devices[0]]} />);

    fireEvent.click(screen.getByTestId("device"));

    expect(deleteMutate).toHaveBeenCalledWith("1");
  });
});
