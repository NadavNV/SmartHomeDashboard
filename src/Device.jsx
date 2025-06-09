import { useState } from "react";
import DeviceOptions from "./DeviceOptions";
import TextInput from "./TextInput";

function Device({ id, type, initDevice, updateDevice, removeDevice, enabled }) {
  const [name, setName] = useState(initDevice.name);
  const [status, setStatus] = useState(initDevice.status);
  const [params, setParams] = useState({ ...initDevice.parameters });
  let statusInput = null;

  function handleStatusChange(nextStatus) {
    let newDevice = {
      id: id,
      type: type,
      name: name,
      status: nextStatus,
      params: params,
    };
    updateDevice(newDevice);
  }

  function handleRemoveDevice() {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      removeDevice(id);
    }
  }

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
            disabled={!enabled}
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
            disabled={!enabled}
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
            disabled={!enabled}
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
            name: newName,
            status: status,
            params: params,
          });
        }}
        disabled={!enabled}
      />{" "}
      {statusInput}{" "}
      <button disabled={!enabled} onClick={handleRemoveDevice}>
        Remove
      </button>
      <DeviceOptions
        type={type}
        options={params}
        onSave={(newParams) => {
          setParams({ ...newParams });
          updateDevice({
            id: id,
            type: type,
            name: name,
            status: status,
            params: { ...newParams },
          });
        }}
        disabled={!enabled}
      />
    </div>
  );
}

export default Device;
