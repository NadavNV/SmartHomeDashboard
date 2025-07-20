import DeviceOptions from "src/components/DeviceOptions";
import TextInput from "src/components/TextInput";

// Displays the information of a single device, and allows editing it.
export default function Device({
  id,
  type, // e.g. water heater, light, etc.
  name,
  room,
  status,
  parameters,
  updateDevice, // Function for updating device configuration
  removeDevice, // Function for removing the device
  disabled, // Whether or not input fields should be disabled
}) {
  // What components to display for the device status,
  // based on the device type.
  let statusInput = null;

  function handleStatusChange(nextStatus) {
    updateDevice({
      id: id,
      changes: {
        status: nextStatus,
      },
    });
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
              handleStatusChange(status === "open" ? "closed" : "open");
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
              handleStatusChange(status === "unlocked" ? "locked" : "unlocked");
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
              handleStatusChange(status === "on" ? "off" : "on");
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
        label="Name: "
        initValue={name}
        onSave={(newName) => {
          updateDevice({
            id: id,
            changes: {
              name: newName,
            },
          });
        }}
        disabled={disabled}
      />{" "}
      {statusInput}
      {" - "}
      <TextInput
        label="Room: "
        initValue={room}
        onSave={(newRoom) => {
          updateDevice({
            id: id,
            changes: {
              room: newRoom,
            },
          });
        }}
        disabled={disabled}
      />{" "}
      <button
        aria-label={"Remove device " + id}
        disabled={disabled}
        onClick={handleRemoveDevice}
      >
        Remove
      </button>
      <DeviceOptions
        device_id={id}
        type={type}
        parameters={{ ...parameters }}
        onSave={(newParameters) => {
          updateDevice({
            id: id,
            changes: {
              parameters: { ...newParameters },
            },
          });
        }}
        disabled={disabled}
      />
    </div>
  );
}
