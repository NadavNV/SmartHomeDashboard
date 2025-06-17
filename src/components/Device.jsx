import { useState } from "react";
import DeviceOptions from "./DeviceOptions";
import TextInput from "./TextInput";

// Displays the information of a single device, and allows editing it.
export default function Device({
  id,
  type, // e.g. water heater, light, etc.
  initDevice, // Initial data
  updateDevice, // Function for updating device configuration
  removeDevice, // Function for removing the device
  deviceAction, // Function for applying an action on the device
  disabled, // Whether or not input fields should be disabled
}) {
  const [name, setName] = useState(initDevice.name);
  const [room, setRoom] = useState(initDevice.room);
  const [status, setStatus] = useState(initDevice.status);
  const [parameters, setParameters] = useState({ ...initDevice.parameters });
  // What components to display for the device status,
  // based on the device type.
  let statusInput = null;

  function handleStatusChange(nextStatus) {
    let newDevice = {
      id: id,
      type: type,
      room: room,
      name: name,
      status: nextStatus,
      parameters: parameters,
    };
    updateDevice(newDevice);
  }

  function handleRemoveDevice() {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      removeDevice(id);
    }
  }

  // What components to display for the device status,
  // based on the device type.
  switch (type) {
    case "curtain":
      statusInput = (
        <label>
          <input
            type="checkbox"
            checked={status === "open"}
            onChange={() => {
              let nextStatus = status === "open" ? "closed" : "open";
              setStatus(nextStatus);
              handleStatusChange(nextStatus);
            }}
            disabled={disabled}
          />
          Open
        </label>
      );
      break;
    case "door_lock":
      statusInput = (
        <label>
          <input
            type="checkbox"
            checked={status === "locked"}
            onChange={() => {
              let nextStatus = status === "open" ? "locked" : "open";
              setStatus(nextStatus);
              handleStatusChange(nextStatus);
            }}
            disabled={disabled}
          />
          Locked
        </label>
      );
      break;
    default:
      statusInput = (
        <label>
          <input
            type="checkbox"
            checked={status === "on"}
            onChange={() => {
              let nextStatus = status === "on" ? "off" : "on";
              setStatus(nextStatus);
              handleStatusChange(nextStatus);
            }}
            disabled={disabled}
          />
          On/Off
        </label>
      );
      break;
  }
  return (
    <div id={id}>
      <TextInput
        initValue={name}
        onSave={(newName) => {
          setName(newName);
          updateDevice({
            id: id,
            type: type,
            room: room,
            name: newName,
            status: status,
            parameters: parameters,
          });
        }}
        disabled={disabled}
      />{" "}
      {statusInput}
      {" - "}
      <label>
        Room:{" "}
        <TextInput
          initValue={room}
          onSave={(newRoom) => {
            setRoom(newRoom);
            updateDevice({
              id: id,
              type: type,
              room: newRoom,
              name: name,
              status: status,
              parameters: parameters,
            });
          }}
        />
      </label>{" "}
      <button disabled={disabled} onClick={handleRemoveDevice}>
        Remove
      </button>
      <DeviceOptions
        type={type}
        parameters={parameters}
        onSave={(newParameters) => {
          setParameters({ ...newParameters });
          deviceAction({
            id: id,
            type: type,
            room: room,
            name: name,
            status: status,
            parameters: { ...newParameters },
          });
        }}
        disabled={disabled}
      />
    </div>
  );
}
