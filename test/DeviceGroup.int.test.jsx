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

import DeviceGroup from "src/components/DeviceGroup";
import * as mutations from "src/services/mutations";

describe("Integration test DeviceGroup component", () => {
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

  it("calls updateDeviceMutation.mutate when updateDevice callback is called", () => {
    const updateMutate = vi.fn();
    // Override the mocked useUpdateDevice to return mutate mock
    mutations.useUpdateDevice.mockImplementation(() => ({
      mutate: updateMutate,
    }));

    // useDeleteDevice can return default mock
    mutations.useDeleteDevice.mockImplementation(() => ({ mutate: vi.fn() }));

    render(<DeviceGroup label="Test" deviceList={[devices[0]]} />);

    fireEvent.click(screen.getByLabelText(/on\/off/i));

    expect(updateMutate).toHaveBeenCalledWith({
      id: "1",
      changes: { status: "off" },
    });
  });

  it("calls deleteDeviceMutation.mutate when removeDevice callback is called", () => {
    const deleteMutate = vi.fn();
    mutations.useDeleteDevice.mockImplementation(() => ({
      mutate: deleteMutate,
    }));
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true)
    );
    mutations.useUpdateDevice.mockImplementation(() => ({ mutate: vi.fn() }));

    render(<DeviceGroup label="Test" deviceList={[devices[0]]} />);

    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to remove Heater?"
    );

    expect(deleteMutate).toHaveBeenCalledWith("1");
  });
});
