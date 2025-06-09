import { useState } from "react";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import TimeInput from "./TimeInput";
import Select from "./Select";

export default function NewDeviceForm({ addDevice, verifyId }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [parameters, setParameters] = useState({});

  function cleanParameters() {
    const newParameters = { ...parameters };
    let allowedKeys = [];
    switch (type) {
      case "water_heater":
        allowedKeys = [
          "temeprature",
          "target_temperature",
          "timer_enabled",
          "scheduled_on",
          "scheduled_off",
        ];
        if (newParameters.temperature === undefined) {
          newParameters.temperature = 60;
        }
        if (newParameters.target_temperature === undefined) {
          newParameters.target_temperature = 60;
        }
        if (newParameters.timer_enabled === undefined) {
          newParameters.timer_enabled = false;
        }
        if (newParameters.timer_enabled) {
          if (newParameters.scheduled_on === undefined) {
            newParameters.scheduled_on = "06:30";
          }
          if (newParameters.scheduled_off === undefined) {
            newParameters.scheduled_off = "08:00";
          }
        }
        break;
      case "light":
        allowedKeys = ["brightness", "color", "is_dimmable", "dynamic_color"];
        if (newParameters.is_dimmable === undefined) {
          newParameters.is_dimmable = false;
        }
        if (newParameters.is_dimmable) {
          if (newParameters.brightness === undefined) {
            newParameters.brightness = 0;
          }
        }
        if (newParameters.dynamic_color === undefined) {
          newParameters.dynamic_color = false;
        }
        if (newParameters.dynamic_color) {
          if (newParameters.color === undefined) {
            newParameters.color = "#FFFFFF";
          }
        }
        break;
      case "door_lock":
        allowedKeys = ["auto_lock_enabled", "battery_level"];
        if (newParameters.auto_lock_enabled === undefined) {
          newParameters.auto_lock_enabled = false;
        }
        if (newParameters.auto_lock_enabled) {
          newParameters.battery_level = 100;
        }
        break;
      case "curtain":
        allowedKeys = ["position"];
        newParameters.position = 100;
        break;
      case "air_conditioner":
        allowedKeys = ["temperature", "mode", "fan_speed", "swing"];
        if (newParameters.temperature === undefined) {
          newParameters.temperature = 24;
        }
        if (newParameters.mode === undefined) {
          newParameters.mode = "cool";
        }
        if (newParameters.fan_speed === undefined) {
          newParameters.fan_speed = "low";
        }
        if (newParameters.swing === undefined) {
          newParameters.swing = "off";
        }
        break;
      default:
        console.log(`Unknown type: ${type}`);
    }

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
      } else if (type === "") {
        alert("Must choose a type");
      } else {
        addDevice({
          id: id,
          name: name,
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
    <div>
      <label>
        Device ID:{" "}
        <TextInput
          initValue={id}
          onSave={(newId) => {
            setId(newId);
          }}
          disabled={false}
        />
      </label>{" "}
      <label>
        Device name:{" "}
        <TextInput
          initValue={name}
          onSave={(newName) => {
            setName(newName);
          }}
          disabled={false}
        />
      </label>{" "}
      <label>
        <Select
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
            switch (newType) {
              case "curtain":
              case "door_lock":
                setStatus("open");
                break;
              default:
                setStatus("off");
                break;
            }
          }}
          disabled={false}
        />
      </label>{" "}
      {type === "water_heater" && (
        <ul>
          <li>
            <label>
              Target temperature:{" "}
              <NumberInput
                initValue={""}
                onSave={(newTemperature) => {
                  setParameters({
                    ...parameters,
                    target_temperature: newTemperature,
                  });
                }}
                disabled={false}
              />
            </label>
          </li>
          <li>
            <label>
              Timer enabled:
              <input
                type="checkbox"
                checked={parameters.timer_enabled ?? false}
                onChange={() => {
                  setParameters({
                    ...parameters,
                    timer_enabled: !(parameters.timer_enabled ?? false),
                  });
                }}
              />
            </label>
            {" Start time: "}
            <TimeInput
              initValue={parameters.scheduled_on ?? ""}
              onSave={(newTime) => {
                setParameters({
                  ...parameters,
                  scheduled_on: newTime,
                });
              }}
              disabled={!(parameters.timer_enabled ?? false)}
            />
            {" Stop time: "}
            <TimeInput
              initValue={parameters.scheduled_off ?? ""}
              onSave={(newTime) => {
                setParameters({
                  ...parameters,
                  scheduled_off: newTime,
                });
              }}
              disabled={!(parameters.timer_enabled ?? false)}
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
                checked={parameters.dynamic_color ?? false}
                onChange={() => {
                  setParameters({
                    ...parameters,
                    dynamic_color: !(parameters.dynamic_color ?? false),
                  });
                }}
              />
            </label>
            {(parameters.dynamic_color ?? false) && (
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
                checked={parameters.is_dimmable ?? false}
                onChange={() => {
                  setParameters({
                    ...parameters,
                    is_dimmable: !(parameters.is_dimmable ?? false),
                  });
                }}
              />
            </label>
            {(parameters.is_dimmable ?? false) && (
              <label>
                {" "}
                Brightness:{" "}
                <NumberInput
                  initValue={0}
                  min={0}
                  max={100}
                  onSave={(newBrightness) => {
                    setParameters({
                      ...parameters,
                      brightness: newBrightness,
                    });
                  }}
                  disabled={false}
                />
              </label>
            )}
          </li>
        </ul>
      )}
      {type === "air_conditioner" && (
        <ul>
          <li>
            <label>
              Temperature:
              <NumberInput
                initValue={24}
                onSave={(newTemperature) => {
                  setParameters({
                    ...parameters,
                    temperature: newTemperature,
                  });
                }}
                disabled={false}
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
              value="cool"
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
              value="low"
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
              value="off"
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
                checked={parameters.auto_lock_enabled ?? false}
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
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
