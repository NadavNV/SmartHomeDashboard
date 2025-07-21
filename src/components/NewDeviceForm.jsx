import { useState } from "react";
import TextInput from "src/components/TextInput";
import NumberInput from "src/components/NumberInput";
import TimeInput from "src/components/TimeInput";
import Select from "src/components/Select";
import {
  DEFAULT_AC_STATUS,
  DEFAULT_AC_FAN,
  DEFAULT_AC_MODE,
  DEFAULT_AC_SWING,
  DEFAULT_AC_TEMP,
  MIN_AC_TEMP,
  MAX_AC_TEMP,
  DEFAULT_LOCK_STATUS,
  DEFAULT_AUTO_LOCK_ENABLED,
  DEFAULT_BATTERY,
  DEFAULT_LIGHT_STATUS,
  DEFAULT_BRIGHTNESS,
  DEFAULT_DIMMABLE,
  DEFAULT_DYNAMIC_COLOR,
  DEFAULT_LIGHT_COLOR,
  MIN_BRIGHTNESS,
  MAX_BRIGHTNESS,
  DEFAULT_CURTAIN_STATUS,
  DEFAULT_POSITION,
  DEFAULT_WATER_HEATER_STATUS,
  MIN_WATER_TEMP,
  MAX_WATER_TEMP,
  DEFAULT_START_TIME,
  DEFAULT_STOP_TIME,
  DEFAULT_TIMER_ENABLED,
  DEFAULT_WATER_TEMP,
} from "src/constants";

// Form for creating a new smart home device. Adjusts based on the type selected
export default function NewDeviceForm({
  // Function for adding a new device. Recieves the new device information,
  // as an object, as its only argument.
  addDevice,
  // Function for verifying that the new ID is unique. Recieves the new
  // ID as its only argument.
  verifyId,
  // Whether or not to disable the save button.
  disabled,
}) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [parameters, setParameters] = useState({});

  // Since the parameters object may include fields from different device types
  // before the new device is saved, this function makes sure it only includes
  // the fields relevant to the currently selected type. It also ensures that
  // all relevant fields are indeed included.
  function cleanParameters() {
    const newParameters = { ...parameters };
    // Which fields to keep
    let allowedKeys = [];
    switch (type) {
      case "water_heater":
        allowedKeys = [
          "temperature",
          "target_temperature",
          "timer_enabled",
          "scheduled_on",
          "scheduled_off",
        ];
        if (newParameters.temperature === undefined) {
          newParameters.temperature = DEFAULT_WATER_TEMP;
        }
        if (newParameters.target_temperature === undefined) {
          newParameters.target_temperature = DEFAULT_WATER_TEMP;
        }
        if (newParameters.timer_enabled === undefined) {
          newParameters.timer_enabled = DEFAULT_TIMER_ENABLED;
        }
        if (newParameters.scheduled_on === undefined) {
          newParameters.scheduled_on = DEFAULT_START_TIME;
        }
        if (newParameters.scheduled_off === undefined) {
          newParameters.scheduled_off = DEFAULT_STOP_TIME;
        }
        break;
      case "light":
        allowedKeys = ["brightness", "color", "is_dimmable", "dynamic_color"];
        if (newParameters.is_dimmable === undefined) {
          newParameters.is_dimmable = DEFAULT_DIMMABLE;
        }
        if (newParameters.is_dimmable) {
          if (newParameters.brightness === undefined) {
            newParameters.brightness = DEFAULT_BRIGHTNESS;
          }
        }
        if (newParameters.dynamic_color === undefined) {
          newParameters.dynamic_color = DEFAULT_DYNAMIC_COLOR;
        }
        if (newParameters.dynamic_color) {
          if (newParameters.color === undefined) {
            newParameters.color = DEFAULT_LIGHT_COLOR;
          }
        }
        break;
      case "door_lock":
        allowedKeys = ["auto_lock_enabled", "battery_level"];
        if (newParameters.auto_lock_enabled === undefined) {
          newParameters.auto_lock_enabled = DEFAULT_AUTO_LOCK_ENABLED;
        }
        if (newParameters.battery_level === undefined) {
          newParameters.battery_level = DEFAULT_BATTERY;
        }
        break;
      case "curtain":
        allowedKeys = ["position"];
        newParameters.position = DEFAULT_POSITION;
        break;
      case "air_conditioner":
        allowedKeys = ["temperature", "mode", "fan_speed", "swing"];
        if (newParameters.temperature === undefined) {
          newParameters.temperature = DEFAULT_AC_TEMP;
        }
        if (newParameters.mode === undefined) {
          newParameters.mode = DEFAULT_AC_MODE;
        }
        if (newParameters.fan_speed === undefined) {
          newParameters.fan_speed = DEFAULT_AC_FAN;
        }
        if (newParameters.swing === undefined) {
          newParameters.swing = DEFAULT_AC_SWING;
        }
        break;
      default:
        console.log(`Unknown type: ${type}`);
    }

    // Remove unnecessary fields
    const filtered = Object.keys(newParameters)
      .filter((key) => allowedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = newParameters[key];
        return obj;
      }, {});
    return filtered;
  }

  function handleSubmit() {
    if (id === "") {
      alert("Must enter an ID");
    } else if (verifyId(id)) {
      if (name === "") {
        alert("Must enter a name");
      } else if (room === "") {
        alert("Must enter a room name");
      } else if (type === "") {
        alert("Must choose a type");
      } else {
        addDevice({
          id: id,
          name: name,
          room: room,
          type: type,
          status: status,
          parameters: cleanParameters(),
        });
      }
    } else {
      alert("ID must be unique, this ID is already taken");
    }
  }

  return (
    <div aria-label="New device form">
      <TextInput
        label="Device ID: "
        initValue={id}
        onSave={(newId) => {
          setId(newId);
        }}
        disabled={false}
      />{" "}
      <TextInput
        label="Device name: "
        initValue={name}
        onSave={(newName) => {
          setName(newName);
        }}
        disabled={false}
      />{" "}
      <TextInput
        label="Room: "
        initValue={room}
        onSave={(newRoom) => {
          setRoom(newRoom);
        }}
        disabled={false}
      />{" "}
      <Select
        data-testid="type-select"
        label="Device type: "
        options={[
          { label: "", value: "" },
          { label: "Water heater", value: "water_heater" },
          { label: "Light", value: "light" },
          { label: "Air conditioner", value: "air_conditioner" },
          { label: "Door lock", value: "door_lock" },
          { label: "Curtain", value: "curtain" },
        ]}
        value={type}
        onChange={(newType) => {
          setType(newType);
          // Set the status based on the selected type
          switch (newType) {
            case "curtain":
              setStatus(DEFAULT_CURTAIN_STATUS);
              break;
            case "door_lock":
              setStatus(DEFAULT_LOCK_STATUS);
              break;
            case "water_heater":
              setStatus(DEFAULT_WATER_HEATER_STATUS);
              break;
            case "air_conditioner":
              setStatus(DEFAULT_AC_STATUS);
              break;
            case "light":
              setStatus(DEFAULT_LIGHT_STATUS);
              break;
            default:
              setStatus("off");
              break;
          }
        }}
        disabled={false}
      />{" "}
      {type === "water_heater" && (
        <ul>
          <li>
            <NumberInput
              label="Target temperature: "
              initValue={DEFAULT_WATER_TEMP}
              min={MIN_WATER_TEMP}
              max={MAX_WATER_TEMP}
              onSave={(newTemperature) => {
                setParameters({
                  ...parameters,
                  target_temperature: newTemperature,
                });
              }}
              disabled={false}
            />
          </li>
          <li>
            <label>
              Timer enabled:
              <input
                type="checkbox"
                checked={parameters.timer_enabled ?? DEFAULT_TIMER_ENABLED}
                onChange={() => {
                  setParameters({
                    ...parameters,
                    timer_enabled: !(
                      parameters.timer_enabled ?? DEFAULT_TIMER_ENABLED
                    ),
                  });
                }}
              />
            </label>{" "}
            <TimeInput
              label="Start time: "
              initValue={parameters.scheduled_on ?? DEFAULT_START_TIME}
              onSave={(newTime) => {
                setParameters({
                  ...parameters,
                  scheduled_on: newTime,
                });
              }}
              disabled={!(parameters.timer_enabled ?? DEFAULT_TIMER_ENABLED)}
            />{" "}
            <TimeInput
              label="Stop time: "
              initValue={parameters.scheduled_off ?? DEFAULT_STOP_TIME}
              onSave={(newTime) => {
                setParameters({
                  ...parameters,
                  scheduled_off: newTime,
                });
              }}
              disabled={!(parameters.timer_enabled ?? DEFAULT_TIMER_ENABLED)}
            />
          </li>
        </ul>
      )}
      {type === "light" && (
        <ul>
          <li>
            <label>
              Dynamic color:
              <input
                type="checkbox"
                checked={parameters.dynamic_color ?? DEFAULT_DYNAMIC_COLOR}
                onChange={() => {
                  setParameters({
                    ...parameters,
                    dynamic_color: !(
                      parameters.dynamic_color ?? DEFAULT_DYNAMIC_COLOR
                    ),
                  });
                }}
              />
            </label>
            {(parameters.dynamic_color ?? DEFAULT_DYNAMIC_COLOR) && (
              <label>
                {" "}
                Color:{" "}
                <input
                  type="color"
                  onBlur={(e) => {
                    setParameters({
                      ...parameters,
                      color: e.target.value,
                    });
                  }}
                />
              </label>
            )}
          </li>
          <li>
            <label>
              Is dimmable:
              <input
                type="checkbox"
                checked={parameters.is_dimmable ?? DEFAULT_DIMMABLE}
                onChange={() => {
                  setParameters({
                    ...parameters,
                    is_dimmable: !(parameters.is_dimmable ?? DEFAULT_DIMMABLE),
                  });
                }}
              />
            </label>
            {(parameters.is_dimmable ?? DEFAULT_DIMMABLE) && (
              <NumberInput
                label="Brightness: "
                initValue={DEFAULT_BRIGHTNESS}
                min={MIN_BRIGHTNESS}
                max={MAX_BRIGHTNESS}
                onSave={(newBrightness) => {
                  setParameters({
                    ...parameters,
                    brightness: newBrightness,
                  });
                }}
                disabled={false}
              />
            )}
          </li>
        </ul>
      )}
      {type === "air_conditioner" && (
        <ul>
          <li>
            <NumberInput
              label="Temperature: "
              initValue={DEFAULT_AC_TEMP}
              min={MIN_AC_TEMP}
              max={MAX_AC_TEMP}
              onSave={(newTemperature) => {
                setParameters({
                  ...parameters,
                  temperature: newTemperature,
                });
              }}
              disabled={false}
            />
          </li>
          <li>
            <Select
              label="Mode: "
              options={[
                { label: "Cooling", value: "cool" },
                { label: "Heating", value: "heat" },
                { label: "Fan", value: "fan" },
              ]}
              value={DEFAULT_AC_MODE}
              onChange={(newMode) => {
                setParameters({
                  ...parameters,
                  mode: newMode,
                });
              }}
              disabled={false}
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
              value={DEFAULT_AC_FAN}
              onChange={(newFanSpeed) => {
                setParameters({
                  ...parameters,
                  fan_speed: newFanSpeed,
                });
              }}
              disabled={false}
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
              value={DEFAULT_AC_SWING}
              onChange={(newSwing) => {
                setParameters({
                  ...parameters,
                  swing: newSwing,
                });
              }}
              disabled={false}
            />
          </li>
        </ul>
      )}
      {type === "door_lock" && (
        <ul>
          <li>
            <label>
              Auto-lock enabled:
              <input
                type="checkbox"
                checked={
                  parameters.auto_lock_enabled ?? DEFAULT_AUTO_LOCK_ENABLED
                }
                onChange={(e) => {
                  setParameters({
                    ...parameters,
                    auto_lock_enabled: e.target.checked,
                  });
                }}
              />
            </label>
          </li>
        </ul>
      )}
      <br />
      <button
        aria-label="Submit form button"
        onClick={handleSubmit}
        disabled={disabled}
      >
        Submit
      </button>
    </div>
  );
}
