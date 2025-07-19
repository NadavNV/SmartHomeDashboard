import { expect, vi } from "vitest";
// Mock components
vi.mock("src/components/NumberInput");
vi.mock("src/components/TimeInput");
vi.mock("src/components/Select");
vi.mock("src/constants");
import { render, screen } from "@testing-library/react";
import DeviceOptions from "src/components/DeviceOptions";

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
          onSave={vi.fn()}
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
          onSave={vi.fn()}
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
          onSave={vi.fn()}
          disabled={false}
        />
      );

      const heating = screen.getByText("Not heating");
      expect(heating).toBeInTheDocument();
      expect(heating).toHaveStyle({ color: "#00BFFF" });
    });
  });
  describe("for lights", () => {
    it("renders the UI", () => {
      render(
        <DeviceOptions
          type="light"
          parameters={{
            is_dimmable: true,
            dynamic_color: true,
            brightness: 75,
            color: "#615243",
          }}
          onSave={vi.fn()}
          disabled={false}
        />
      );

      expect(screen.getByText(/brightness/i)).toBeInTheDocument();
      expect(screen.getByTestId("mock-number-input")).toBeInTheDocument();
      expect(screen.getByText(/color/i)).toBeInTheDocument();
      expect(screen.getByTestId("color-picker")).toBeInTheDocument();
    });
    it("doesn't render the brightness if not dimmable", () => {
      render(
        <DeviceOptions
          type="light"
          parameters={{
            is_dimmable: false,
            dynamic_color: true,
            brightness: 75,
            color: "#615243",
          }}
          onSave={vi.fn()}
          disabled={false}
        />
      );

      expect(screen.queryByText(/brightness/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId("mock-number-input")).not.toBeInTheDocument();
    });
    it("doesn't render the color if not dynamic color", () => {
      render(
        <DeviceOptions
          type="light"
          parameters={{
            is_dimmable: true,
            dynamic_color: false,
            brightness: 75,
            color: "#615243",
          }}
          onSave={vi.fn()}
          disabled={false}
        />
      );

      expect(screen.queryByText(/color/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId("color-picker")).not.toBeInTheDocument();
    });
  });
  describe("for air conditioners", () => {
    it("renders the UI for air conditioner", () => {
      render(
        <DeviceOptions
          type="air_conditioner"
          parameters={{
            temperature: 22,
            mode: "cool",
            fan_speed: "low",
            swing: "auto",
          }}
          onsave={vi.fn()}
          disabled={false}
        />
      );
      expect(screen.getByText(/temperature/i)).toBeInTheDocument();
      expect(screen.getByTestId("mock-number-input")).toBeInTheDocument();
      expect(screen.getAllByTestId("mock-select")).toHaveLength(3);
    });
  });
  describe("for door locks", () => {
    it("renders the UI for door lock", () => {
      render(
        <DeviceOptions
          type="door_lock"
          parameters={{
            auto_lock_enabled: true,
            battery_level: 72,
          }}
          onSave={vi.fn()}
          disabled={false}
        />
      );

      expect(screen.getByText(/auto-lock/i)).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByText(/battery/i)).toBeInTheDocument();
    });
  });
  describe("for curtains", () => {
    it("renders the UI for curtains", () => {
      render(
        <DeviceOptions
          type="curtain"
          parameters={{
            position: 72,
          }}
          onSave={vi.fn()}
          disabled={false}
        />
      );

      expect(screen.getByText(/position/i)).toBeInTheDocument();
    });
  });
  describe("when the type is unknown", () => {
    it("renders the UI for curtains", () => {
      render(
        <DeviceOptions
          type="steve"
          parameters={{}}
          onSave={vi.fn()}
          disabled={false}
        />
      );

      expect(screen.getByText(/unknown device type/i)).toBeInTheDocument();
    });
  });
});
