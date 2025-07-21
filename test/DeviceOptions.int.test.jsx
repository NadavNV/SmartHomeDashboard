import { expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DeviceOptions from "src/components/DeviceOptions";

describe("Integration test DeviceOptions component", () => {
  describe("for water heater devices", () => {
    it("disables inputs when disabled", () => {
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
          disabled={true}
        />
      );
      expect(screen.getByLabelText(/target temperature/i)).toBeDisabled();
      expect(screen.getByLabelText(/timer enabled/i)).toBeDisabled();
      expect(screen.getByLabelText(/start time/i)).toBeDisabled();
      expect(screen.getByLabelText(/stop time/i)).toBeDisabled();
      const buttons = screen.getAllByRole("button");
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });
  });
  describe("for lights", () => {
    it("disables inputs when disabled", () => {
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
          disabled={true}
        />
      );

      expect(screen.getByLabelText(/brightness/i)).toBeDisabled();
      expect(screen.getByLabelText(/color/i)).toBeDisabled();
      const buttons = screen.getAllByRole("button");
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });
  });
  describe("for air conditioners", () => {
    it("disables inputs when disabled", () => {
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
          disabled={true}
        />
      );
      expect(screen.getByLabelText(/temperature/i)).toBeDisabled();
      expect(screen.getByLabelText(/mode/i)).toBeDisabled();
      expect(screen.getByLabelText(/fan/i)).toBeDisabled();
      expect(screen.getByLabelText(/swing/i)).toBeDisabled();
      const buttons = screen.getAllByRole("button");
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });
  });
  describe("for door locks", () => {
    it("disables inputs when disabled", () => {
      render(
        <DeviceOptions
          type="door_lock"
          parameters={{
            auto_lock_enabled: true,
            battery_level: 72,
          }}
          onSave={vi.fn()}
          disabled={true}
        />
      );

      expect(screen.getByLabelText(/auto-lock/i)).toBeDisabled();
    });
  });
});
