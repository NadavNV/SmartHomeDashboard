import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
// Mock componentss
vi.mock("src/components/DeviceOptions");
vi.mock("src/components/TextInput");
import Device from "src/components/Device";

describe("Device component", () => {
  const updateDevice = vi.fn();
  const removeDevice = vi.fn();

  const baseProps = {
    id: "device-1",
    name: "Lamp",
    type: "light",
    room: "Bedroom",
    status: "on",
    parameters: {},
    updateDevice,
    removeDevice,
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders TextInputs and DeviceOptions", () => {
    render(<Device {...baseProps} />);
    expect(screen.getAllByTestId("mock-text-input")).toHaveLength(2);
    expect(screen.getByTestId("mock-device-options")).toBeInTheDocument();
  });

  it("renders correct status input for curtain", () => {
    render(<Device {...baseProps} type="curtain" status="open" />);
    const checkbox = screen.getByLabelText("Open");
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(updateDevice).toHaveBeenCalledWith({
      id: "device-1",
      changes: { status: "closed" },
    });
  });

  it("renders correct status input for door_lock", () => {
    render(<Device {...baseProps} type="door_lock" status="unlocked" />);
    const checkbox = screen.getByLabelText("Locked");
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(updateDevice).toHaveBeenCalledWith({
      id: "device-1",
      changes: { status: "locked" },
    });
  });

  it("toggles status for default device types (e.g. light)", () => {
    render(<Device {...baseProps} />);
    const checkbox = screen.getByLabelText("On/Off");
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(updateDevice).toHaveBeenCalledWith({
      id: "device-1",
      changes: { status: "off" },
    });
  });

  it("calls removeDevice if confirmed", () => {
    global.confirm = vi.fn(() => true);
    render(<Device {...baseProps} />);
    fireEvent.click(screen.getByText("Remove"));
    expect(removeDevice).toHaveBeenCalledWith("device-1");
  });

  it("does not call removeDevice if user cancels", () => {
    global.confirm = vi.fn(() => false);
    render(<Device {...baseProps} />);
    fireEvent.click(screen.getByText("Remove"));
    expect(removeDevice).not.toHaveBeenCalled();
  });
});
