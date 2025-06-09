import { useState } from "react";
import Device from "./Device";
import NewDeviceForm from "./NewDeviceForm";

function DeviceList({ initData }) {
  const [deviceList, setDeviceList] = useState(initData);
  const [status, setStatus] = useState("ready");
  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(Date.now().toString());

  const devices = deviceList.map((device) => {
    return (
      <li key={device.id}>
        <Device
          id={device.id}
          type={device.type}
          initDevice={{
            name: device.name,
            status: device.status,
            parameters: { ...device.parameters },
          }}
          updateDevice={(updatedDevice) => {
            setStatus("updating");
            console.log("Updating device:");
            console.log(updatedDevice);
            setDeviceList(
              deviceList.map((device) => {
                if (device.id === updatedDevice.id) {
                  return updatedDevice;
                } else {
                  return device;
                }
              })
            );
            setStatus("ready");
          }}
          removeDevice={(idToDelete) => {
            setStatus("updating");
            setDeviceList(deviceList.filter((d) => d.id !== idToDelete));
            setStatus("ready");
          }}
          enabled={status === "ready"}
        />
        <br />
      </li>
    );
  });

  return (
    <div>
      <ul>{devices}</ul>
      <hr />
      <button
        onClick={() => {
          if (!showForm) {
            setShowForm(true);
          }
        }}
      >
        Add device
      </button>
      <br />
      <br />
      {showForm && (
        <NewDeviceForm
          key={formKey}
          addDevice={(newDevice) => {
            setDeviceList([...deviceList, newDevice]);
            setFormKey(Date.now().toString());
            setShowForm(false);
          }}
          verifyId={(newId) => {
            console.log(`New ID: ${newId}`);
            for (const device of deviceList) {
              console.log(`D: ${device.id}`);
              if (device.id === newId) {
                return false;
              }
            }
            return true;
          }}
        />
      )}
    </div>
  );
}

export default DeviceList;
