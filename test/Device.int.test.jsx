import { render, fireEvent, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
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
    parameters: {
      is_dimmable: true,
      brightness: 70,
      dynamic_light: false,
    },
    updateDevice,
    removeDevice,
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables inputs when disabled=true", () => {
    render(<Device {...baseProps} disabled={true} />);
    const buttons = screen.getAllByRole("button");
    for (const button of buttons) {
      expect(button).toBeDisabled();
    }
  });

  it("updates name correctly", () => {
    render(<Device {...baseProps} />);
    const editButton = screen.getByRole("button", { name: /edit name/i });
    fireEvent.click(editButton);
    const textField = screen.getByRole("textbox", { name: /name/i });
    fireEvent.change(textField, { target: { value: "Steve" } });
    const saveButton = screen.getByRole("button", { name: /save name/i });
    fireEvent.click(saveButton);
    expect(updateDevice).toHaveBeenCalledWith({
      id: "device-1",
      changes: { name: "Steve" },
    });
  });

  it("updates room correctly", () => {
    render(<Device {...baseProps} />);
    const editButton = screen.getByRole("button", { name: /edit room/i });
    fireEvent.click(editButton);
    const textField = screen.getByRole("textbox", { name: /room/i });
    fireEvent.change(textField, { target: { value: "Steve" } });
    const saveButton = screen.getByRole("button", { name: /save room/i });
    fireEvent.click(saveButton);
    expect(updateDevice).toHaveBeenCalledWith({
      id: "device-1",
      changes: { room: "Steve" },
    });
  });

  it("updates parameters correctly", () => {
    render(<Device {...baseProps} />);
    const editButton = screen.getByRole("button", { name: /edit brightness/i });
    fireEvent.click(editButton);
    const textField = screen.getByRole("spinbutton", { name: /brightness/i });
    fireEvent.change(textField, { target: { value: 80 } });
    const saveButton = screen.getByRole("button", { name: /save brightness/i });
    fireEvent.click(saveButton);
    expect(updateDevice).toHaveBeenCalledWith({
      id: "device-1",
      changes: { parameters: { brightness: "80" } },
    });
  });
});
