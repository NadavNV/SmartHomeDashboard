import { useState, useEffect, useCallback, useRef } from "react";
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
  const timeoutId = useRef(null);

  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const createDeviceMutation = useCreateDevice(() => {
    // Resets the new device form upon successful device creation
    setFormKey(Date.now().toString());
    setShowForm(false);
  });
  const deleteDeviceMutation = useDeleteDevice();
  const updateDeviceMutation = useUpdateDevice();
  const deviceActionMutation = useDeviceAction();

  const queryClient = useQueryClient();

  const handleReload = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  }, [queryClient]);

  const restartAutoReload = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(handleReload, 5000);
  }, [handleReload]);

  useEffect(() => {
    if (isFetching === 0 && isMutating === 0) {
      restartAutoReload();
    }

    window.addEventListener("mousemove", restartAutoReload);
    window.addEventListener("keydown", restartAutoReload);

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        window.removeEventListener("mousemove", restartAutoReload);
        window.removeEventListener("keydown", restartAutoReload);
      }
    };
  }, [isFetching, isMutating, restartAutoReload]);

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
      </button>{" "}
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
