import { useState } from "react";
import {
  useIsFetching,
  useIsMutating,
  useQueryClient,
} from "@tanstack/react-query";
import Device from "./Device";
import NewDeviceForm from "./NewDeviceForm";
import { useDevices } from "../services/queries";
import {
  useCreateDevice,
  useDeleteDevice,
  useDeviceAction,
  useUpdateDevice,
} from "../services/mutations";

function DeviceList() {
  const devicesQuery = useDevices();

  const [showForm, setShowForm] = useState(false);
  const [formKey, setFormKey] = useState(Date.now().toString());

  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const createDeviceMutation = useCreateDevice(() => {
    setFormKey(Date.now().toString());
    setShowForm(false);
  });
  const deleteDeviceMutation = useDeleteDevice();
  const updateDeviceMutation = useUpdateDevice();
  const deviceActionMutation = useDeviceAction();

  const queryClient = useQueryClient();

  function handleReload() {
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  }

  const devices = (devicesQuery.data ?? []).map((device) => {
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
            updateDeviceMutation.mutate(updatedDevice);
          }}
          removeDevice={(idToDelete) => {
            deleteDeviceMutation.mutate(idToDelete);
          }}
          deviceAction={(updatedDevice) => {
            deviceActionMutation.mutate(updatedDevice);
          }}
          disabled={isFetching > 0 || isMutating > 0}
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
      <button onClick={handleReload}>Reload</button>
      <br />
      <br />
      {showForm && (
        <NewDeviceForm
          key={formKey}
          addDevice={(newDevice) => {
            createDeviceMutation.mutate(newDevice);
          }}
          verifyId={(newId) => {
            for (const device of devicesQuery.data ?? []) {
              if (device.id === newId) {
                return false;
              }
            }
            return true;
          }}
          disabled={isFetching > 0 || isMutating > 0}
        />
      )}
    </div>
  );
}

export default DeviceList;
