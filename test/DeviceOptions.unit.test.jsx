import { render, screen } from "@testing-library/react";

// Mock components
jest.mock("src/components/NumberInput");
jest.mock("src/components/TimeInput");
jest.mock("src/components/Select");

describe("Test DeviceOptions component", () => {
  describe("for water heater devices", () => {
    it("renders water heater options UI", () => {
      render(
        <DeviceOptions
          type="water_heater"
          parameters={{
            temperature: 45,
            target_temperature: 50,
            is_heating: true,
            timer_enabled: false,
            scheduled_on: "06:30",
            scheduled_off: "08:00",
          }}
          onSave={jest.fn()}
          disabled={false}
        />
      );
      expect(screen.getByText(/Temperature:/)).toBeInTheDocument();
      expect(screen.getByTestId("mock-number-input")).toBeInTheDocument(); // Target temperature
      expect(screen.getByRole("checkbox")).toBeInTheDocument(); // Timer enabled
      expect(screen.getAllByTestId("mock-time-input")).toHaveLength(2); // scheduled_on + scheduled_off
    });
    it("renders orange text when heating", () => {
      render(
        <DeviceOptions
          type="water_heater"
          parameters={{
            temperature: 45,
            target_temperature: 50,
            is_heating: true,
            timer_enabled: false,
            scheduled_on: "06:30",
            scheduled_off: "08:00",
          }}
          onSave={jest.fn()}
          disabled={false}
        />
      );

      const heating = screen.getByText("Heating");
      expect(heating).toBeInTheDocument();
      expect(heating).toHaveStyle({ color: "#FF4500" });
    });

    it("renders blue text when not heating", () => {
      render(
        <DeviceOptions
          type="water_heater"
          parameters={{
            temperature: 45,
            target_temperature: 50,
            is_heating: false,
            timer_enabled: false,
            scheduled_on: "06:30",
            scheduled_off: "08:00",
          }}
          onSave={jest.fn()}
          disabled={false}
        />
      );

      const heating = screen.getByText("Not heating");
      expect(heating).toBeInTheDocument();
      expect(heating).toHaveStyle({ color: "#00BFFF" });
    });
  });
  describe("for lights", () => {
    // TODO: Add light tests
  });
  describe("for air conditioners", () => {
    // TODO: Add air conditioner tests
  });
  describe("for door locks", () => {
    // TODO: Add door lock tests
  });
  describe("for curtains", () => {
    // TODO Add curtain tests
  });
  describe("when the type is unknown", () => {
    // TODO: Add error tests
  });
});
