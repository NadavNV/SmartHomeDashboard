import TimeInput from "./TimeInput";
import NumberInput from "./NumberInput";
import Select from "./Select";

function DeviceOptions({ type, options, onSave, disabled }) {
  switch (type) {
    case "water_heater":
      return (
        <ul>
          <li>
            Temperature: {options.temperature}
            {" Target temperature: "}
            <NumberInput
              initValue={options.target_temperature}
              onSave={(newTemperature) => {
                onSave({
                  ...options,
                  target_temperature: newTemperature,
                });
              }}
              disabled={disabled}
            />
          </li>
          <li>
            <label>
              Timer enabled:
              <input
                disabled={disabled}
                type="checkbox"
                checked={options.timer_enabled}
                onChange={() => {
                  onSave({
                    ...options,
                    timer_enabled: !options.timer_enabled,
                  });
                }}
              />
            </label>
            {" Start time: "}
            <TimeInput
              initValue={options.scheduled_on}
              onSave={(newTime) => {
                onSave({
                  ...options,
                  scheduled_on: newTime,
                });
              }}
              disabled={disabled}
            />
            {" Stop time: "}
            <TimeInput
              initValue={options.scheduled_off}
              onSave={(newTime) => {
                onSave({
                  ...options,
                  scheduled_off: newTime,
                });
              }}
              disabled={disabled}
            />
          </li>
        </ul>
      );
    case "light":
      return (
        <ul>
          {options.is_dimmable && (
            <li>
              Brightness:{" "}
              <NumberInput
                initValue={options.brightness}
                min={0}
                max={100}
                onSave={(newBrightness) => {
                  onSave({
                    ...options,
                    brightness: newBrightness,
                  });
                }}
                disabled={disabled}
              />
            </li>
          )}
          {options.dynamic_color && (
            <li>
              <label>
                Color:{" "}
                <input
                  disabled={disabled}
                  type="color"
                  defaultValue={options.color}
                  onBlur={(e) => {
                    onSave({
                      ...options,
                      color: e.target.value,
                    });
                  }}
                />
              </label>
            </li>
          )}
        </ul>
      );
    case "air_conditioner":
      return (
        <ul>
          <li>
            <label>
              Temperature:
              <NumberInput
                initValue={options.temperature}
                onSave={(newTemperature) => {
                  onSave({
                    ...options,
                    temperature: newTemperature,
                  });
                }}
                disabled={disabled}
              />
            </label>
          </li>
          <li>
            <Select
              label="Mode: "
              options={[
                { label: "Cooling", value: "cool" },
                { label: "Heating", value: "heat" },
                { label: "Fan", value: "fan" },
              ]}
              value={options.mode}
              onChange={(newMode) => {
                onSave({
                  ...options,
                  mode: newMode,
                });
              }}
              disabled={disabled}
            />
          </li>
          <li>
            <Select
              label="Fan: "
              options={[
                { label: "Off", value: "off" },
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
              ]}
              value={options.fan_speed}
              onChange={(newFanSpeed) => {
                onSave({
                  ...options,
                  fan_speed: newFanSpeed,
                });
              }}
              disabled={disabled}
            />
          </li>
          <li>
            <Select
              label="Swing: "
              options={[
                { label: "Off", value: "off" },
                { label: "On", value: "on" },
                { label: "Auto", value: "auto" },
              ]}
              value={options.swing}
              onChange={(newSwing) => {
                onSave({
                  ...options,
                  swing: newSwing,
                });
              }}
              disabled={disabled}
            />
          </li>
        </ul>
      );
    case "door_lock":
      return (
        <ul>
          <li>
            <label>
              Auto-lock enabled:
              <input
                disabled={disabled}
                type="checkbox"
                checked={options.auto_lock_enabled}
                readOnly={true}
              />
            </label>
          </li>
          <li>{`Battery level: ${options.battery_level}`}</li>
        </ul>
      );
    case "curtain":
      return (
        <ul>
          <li>{`Position: ${options.position}`}</li>
        </ul>
      );
    default:
      return null;
  }
}

export default DeviceOptions;
