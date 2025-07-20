import { expect, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";

import NewDeviceForm from "src/components/NewDeviceForm";

global.alert = vi.fn();

const mockAddDevice = vi.fn();
const mockVerifyId = vi.fn();

describe("Test NewDeviceForm", () => {
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
    fireEvent.change(screen.getByLabelText(/select device type/i));
  });
  it("renders the air conditioner options when type is air conditioner", () => {});
  it("renders the light options when type is light", () => {});
  it("renders the color picker only when dynamic color is true");
  it("renders the brightness input only when dimmable is true");
  it("renders the door lock options when type is door lock", () => {});
  it("renders the curtain options when type is curtain", () => {});
  it("hides previous type options when changing type");
  it("validates the data when submitting", () => {});
  it("cleans parameters before submitting valid data", () => {});
});
