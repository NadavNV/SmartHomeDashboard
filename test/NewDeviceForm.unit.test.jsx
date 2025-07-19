import { expect, vi } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
vi.mock("src/components/TextInput");
vi.mock("src/components/NumberInput");
vi.mock("src/components/TimeInput");
vi.mock("src/components/Select");
vi.mock("src/constants");

import NewDeviceForm from "src/components/NewDeviceForm";

global.alert = vi.fn();

const mockAddDevice = vi.fn();
const mockVerifyId = vi.fn();

describe("Test NewDeviceForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders the blank UI initially", () => {
    render(
      <NewDeviceForm
        addDevice={mockAddDevice}
        verifyId={mockVerifyId}
        disabled={false}
      />
    );
    expect(screen.getByText(/device id/i)).toBeInTheDocument();
    expect(screen.getByText(/device name/i)).toBeInTheDocument();
    expect(screen.getByText(/room/i)).toBeInTheDocument();
    expect(screen.getByText(/mock select/i)).toBeInTheDocument();
    // No device-specific inputs rendered initially
    expect(screen.queryByText(/temperature/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/brightness/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
  //   it("renders the water heater options when type is awter heater", () => {});
  //   it("renders the air conditioner options when type is air conditioner", () => {});
  //   it("renders the light options when type is light", () => {});
  //   it("renders the color picker only when dynamic color is true");
  //   it("renders the brightness input only when dimmable is true");
  //   it("renders the door lock options when type is door lock", () => {});
  //   it("renders the curtain options when type is curtain", () => {});
  //   it("hides previous type options when changing type");
  //   it("validates the data when submitting", () => {});
  //   it("cleans parameters before submitting valid data", () => {});
});
