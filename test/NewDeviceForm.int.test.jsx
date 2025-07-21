import { expect, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";

import NewDeviceForm from "src/components/NewDeviceForm";
import {
  DEFAULT_WATER_HEATER_STATUS,
  DEFAULT_START_TIME,
  DEFAULT_STOP_TIME,
  DEFAULT_TIMER_ENABLED,
  DEFAULT_WATER_TEMP,
  DEFAULT_AC_STATUS,
  DEFAULT_AC_FAN,
  DEFAULT_AC_MODE,
  DEFAULT_AC_SWING,
  DEFAULT_AC_TEMP,
  DEFAULT_LOCK_STATUS,
  DEFAULT_AUTO_LOCK_ENABLED,
  DEFAULT_BATTERY,
  DEFAULT_LIGHT_STATUS,
  DEFAULT_BRIGHTNESS,
  DEFAULT_DIMMABLE,
  DEFAULT_DYNAMIC_COLOR,
  DEFAULT_LIGHT_COLOR,
  DEFAULT_CURTAIN_STATUS,
  DEFAULT_POSITION,
} from "src/constants";

global.alert = vi.fn();

const mockAddDevice = vi.fn();
const mockVerifyId = vi.fn();

describe("Integration test NewDeviceForm component", () => {
  const baseProps = {
    addDevice: mockAddDevice,
    verifyId: mockVerifyId,
    disabled: false,
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders the water heater options when type is water heater", () => {
    render(<NewDeviceForm {...baseProps} />);
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "water_heater" },
    });
    expect(screen.queryByLabelText(/target temperature/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/timer enabled/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/start time/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/stop time/i)).toBeInTheDocument();
  });
  it("renders the air conditioner options when type is air conditioner", () => {
    render(<NewDeviceForm {...baseProps} />);
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "air_conditioner" },
    });
    expect(screen.queryByLabelText(/temperature/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/mode/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/fan/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/swing/i)).toBeInTheDocument();
  });
  it("renders the light options when type is light", () => {
    render(<NewDeviceForm {...baseProps} />);
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "light" },
    });
    expect(screen.queryByLabelText(/dynamic color/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/is dimmable/i)).toBeInTheDocument();
  });
  it("renders the color picker only when dynamic color is true", () => {
    render(<NewDeviceForm {...baseProps} />);
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "light" },
    });
    const dynamicColorCheckbox = screen.getByLabelText(/dynamic color/i);
    expect(screen.queryByLabelText(/^color/i)).not.toBeInTheDocument();
    fireEvent.click(dynamicColorCheckbox);
    expect(screen.queryByLabelText(/^color/i)).toBeInTheDocument();
    fireEvent.click(dynamicColorCheckbox);
    expect(screen.queryByLabelText(/^color/i)).not.toBeInTheDocument();
  });
  it("renders the brightness input only when dimmable is true", () => {
    render(<NewDeviceForm {...baseProps} />);
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "light" },
    });
    const isDimmableCheckbox = screen.getByLabelText(/is dimmable/i);
    expect(screen.queryByLabelText(/brightness/i)).not.toBeInTheDocument();
    fireEvent.click(isDimmableCheckbox);
    expect(screen.queryByLabelText(/brightness/i)).toBeInTheDocument();
    fireEvent.click(isDimmableCheckbox);
    expect(screen.queryByLabelText(/brightness/i)).not.toBeInTheDocument();
  });
  it("renders the door lock options when type is door lock", () => {
    render(<NewDeviceForm {...baseProps} />);
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "door_lock" },
    });
    expect(screen.queryByLabelText(/auto-lock/i)).toBeInTheDocument();
  });
  it("hides previous type options when changing type", () => {
    render(<NewDeviceForm {...baseProps} />);
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "water_heater" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "curtain" },
    });
    expect(
      screen.queryByLabelText(/target temperature/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/timer enabled/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/start time/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/stop time/i)).not.toBeInTheDocument();
  });
  it("validates the data when submitting", () => {
    render(<NewDeviceForm {...baseProps} />);
    mockVerifyId.mockReturnValueOnce(false);
    fireEvent.click(screen.getByRole("button", { name: /submit form/i })); // alert Must enter an ID
    fireEvent.click(screen.getByRole("button", { name: /edit device id/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /device id/i }), {
      target: { value: "steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device id/i }));
    fireEvent.click(screen.getByLabelText(/submit form/i)); // alert ID must be unique
    mockVerifyId.mockImplementation(() => true);
    fireEvent.click(screen.getByLabelText(/submit form/i)); // alert Must enter a name
    fireEvent.click(screen.getByRole("button", { name: /edit device name/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device name/i }));
    fireEvent.click(screen.getByLabelText(/submit form/i)); // alert Must enter a room
    fireEvent.click(screen.getByRole("button", { name: /edit room/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /room/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save room/i }));
    fireEvent.click(screen.getByLabelText(/submit form/i)); // alert Must choose a type
    const calls = [
      "Must enter an ID",
      "ID must be unique, this ID is already taken",
      "Must enter a name",
      "Must enter a room name",
      "Must choose a type",
    ];
    calls.forEach((msg, i) => {
      expect(global.alert).toHaveBeenNthCalledWith(i + 1, msg);
    });
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "light" },
    });
    fireEvent.click(screen.getByLabelText(/submit form/i));
    expect(mockAddDevice).toHaveBeenCalled();
  });
  it("cleans parameters before submitting valid data, and correctly passes default water heater parameters", () => {
    render(<NewDeviceForm {...baseProps} />);
    mockVerifyId.mockReturnValue = true;
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "light" },
    });
    fireEvent.click(screen.getByRole("button", { name: /edit device id/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /device id/i }), {
      target: { value: "steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device id/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit device name/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device name/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit room/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /room/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save room/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /is dimmable/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit brightness/i }));
    fireEvent.change(screen.getByRole("spinbutton", { name: /brightness/i }), {
      target: { value: 65 },
    });
    fireEvent.click(screen.getByRole("button", { name: /save brightness/i }));
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "water_heater" },
    });
    fireEvent.click(screen.getByLabelText(/submit form/i));
    expect(mockAddDevice).toHaveBeenCalledWith({
      id: "steve",
      name: "Steve",
      room: "Steve",
      type: "water_heater",
      status: DEFAULT_WATER_HEATER_STATUS,
      parameters: {
        temperature: DEFAULT_WATER_TEMP,
        target_temperature: DEFAULT_WATER_TEMP,
        timer_enabled: DEFAULT_TIMER_ENABLED,
        scheduled_on: DEFAULT_START_TIME,
        scheduled_off: DEFAULT_STOP_TIME,
      },
    });
  });
  it("correctly passes default ac parameters", () => {
    render(<NewDeviceForm {...baseProps} />);
    mockVerifyId.mockReturnValue = true;
    fireEvent.click(screen.getByRole("button", { name: /edit device id/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /device id/i }), {
      target: { value: "steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device id/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit device name/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device name/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit room/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /room/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save room/i }));
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "air_conditioner" },
    });
    fireEvent.click(screen.getByLabelText(/submit form/i));
    expect(mockAddDevice).toHaveBeenCalledWith({
      id: "steve",
      name: "Steve",
      room: "Steve",
      type: "air_conditioner",
      status: DEFAULT_AC_STATUS,
      parameters: {
        temperature: DEFAULT_AC_TEMP,
        mode: DEFAULT_AC_MODE,
        fan_speed: DEFAULT_AC_FAN,
        swing: DEFAULT_AC_SWING,
      },
    });
  });
  it("correctly passes default light parameters", () => {
    render(<NewDeviceForm {...baseProps} />);
    mockVerifyId.mockReturnValue = true;
    fireEvent.click(screen.getByRole("button", { name: /edit device id/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /device id/i }), {
      target: { value: "steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device id/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit device name/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device name/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit room/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /room/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save room/i }));
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "light" },
    });
    fireEvent.click(screen.getByLabelText(/submit form/i));
    expect(mockAddDevice).toHaveBeenCalledWith({
      id: "steve",
      name: "Steve",
      room: "Steve",
      type: "light",
      status: DEFAULT_LIGHT_STATUS,
      parameters: {
        is_dimmable: DEFAULT_DIMMABLE,
        dynamic_color: DEFAULT_DYNAMIC_COLOR,
      },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: /color/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /dimmable/i }));
    fireEvent.click(screen.getByLabelText(/submit form/i));
    expect(mockAddDevice).toHaveBeenCalledWith({
      id: "steve",
      name: "Steve",
      room: "Steve",
      type: "light",
      status: DEFAULT_LIGHT_STATUS,
      parameters: {
        is_dimmable: !DEFAULT_DIMMABLE,
        dynamic_color: !DEFAULT_DYNAMIC_COLOR,
        color: DEFAULT_LIGHT_COLOR,
        brightness: DEFAULT_BRIGHTNESS,
      },
    });
  });
  it("correctly passes default door lock parameters", () => {
    render(<NewDeviceForm {...baseProps} />);
    mockVerifyId.mockReturnValue = true;
    fireEvent.click(screen.getByRole("button", { name: /edit device id/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /device id/i }), {
      target: { value: "steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device id/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit device name/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device name/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit room/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /room/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save room/i }));
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "door_lock" },
    });
    fireEvent.click(screen.getByLabelText(/submit form/i));
    expect(mockAddDevice).toHaveBeenCalledWith({
      id: "steve",
      name: "Steve",
      room: "Steve",
      type: "door_lock",
      status: DEFAULT_LOCK_STATUS,
      parameters: {
        auto_lock_enabled: DEFAULT_AUTO_LOCK_ENABLED,
        battery_level: DEFAULT_BATTERY,
      },
    });
  });
  it("correctly passes default curtain parameters", () => {
    render(<NewDeviceForm {...baseProps} />);
    mockVerifyId.mockReturnValue = true;
    fireEvent.click(screen.getByRole("button", { name: /edit device id/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /device id/i }), {
      target: { value: "steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device id/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit device name/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save device name/i }));
    fireEvent.click(screen.getByRole("button", { name: /edit room/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /room/i }), {
      target: { value: "Steve" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save room/i }));
    fireEvent.change(screen.getByRole("combobox", { name: /type/i }), {
      target: { value: "curtain" },
    });
    fireEvent.click(screen.getByLabelText(/submit form/i));
    expect(mockAddDevice).toHaveBeenCalledWith({
      id: "steve",
      name: "Steve",
      room: "Steve",
      type: "curtain",
      status: DEFAULT_CURTAIN_STATUS,
      parameters: {
        position: DEFAULT_POSITION,
      },
    });
  });
});
