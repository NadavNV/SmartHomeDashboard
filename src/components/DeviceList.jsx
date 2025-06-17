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

// The main component of the app.
// Displays a status message at the top, below it a list of all device
// information, which allows editing device information and automatically
// updating the server. Below that are buttons to manually reload device
// information or display a form for adding a new device.
// Device information is automatically reacquired after one minute
// without any user actions.
export default function DeviceList() {
  // Query to fetch all device information from the server
  const devicesQuery = useDevices();

  // Whether or not to display the new device form
  const [showForm, setShowForm] = useState(false); 
  // Used for resetting the new device form after a new device is added
  const [formKey, setFormKey] = useState(Date.now().toString());

  // ID for the timeout used to refresh the data
  const timeoutId = useRef(null);

  // The number of queries currently pending
  const isFetching = useIsFetching();
  // The number of mutations currently pending
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

  // Reload all device information
  const handleReload = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  }, [queryClient]);

  // Restart the timer until automatic reloading of device data
  const restartAutoReload = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(handleReload, 60000);
  }, [handleReload]);

  // Auto-reload device information
  useEffect(() => {
    // If no requests are pending, start the timer
    if (isFetching === 0 && isMutating === 0) {
      restartAutoReload();
    }

    // Restart the timer upon any user action
    window.addEventListener("mousemove", restartAutoReload);
    window.addEventListener("keydown", restartAutoReload);

    return () => {
      // Cleanup
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      window.removeEventListener("mousemove", restartAutoReload);
      window.removeEventListener("keydown", restartAutoReload);
    };
  }, [isFetching, isMutating, restartAutoReload]);

  // Used to display when device information was last retrieved
  const currentTime = Date.toLocaleTimeString('en-GB');

  // Convert device objects into React components
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
          // Disable input fields while there are pending requests
          disabled={isFetching > 0 || isMutating > 0}
        />
      </li>
    );
  });

  return (
    <div>
      {/* Status message */}
      { (isFetching > 0 || isMutating > 0) && <h1>Updating...</h1> }
      { 
        (isFetching === 0 && isMutating === 0) &&
        <h1>{`Data retrievd at ${currentTime}`}</h1>
      }
      <hr />
      {/* Devices list */}
      <ul>{devices}</ul>
      <hr />
      {/* Buttons */}
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
      {/* New device form */}
      {showForm && (
        <NewDeviceForm
          key={formKey}
          addDevice={(newDevice) => {
            createDeviceMutation.mutate(newDevice);
          }}
          verifyId={(newId) => {
            // Disallow existing IDs 
            for (const device of devicesQuery.data ?? []) {
              if (device.id === newId) {
                return false;
              }
            }
            return true;
          }}
          // Disable input fields while there are pending requests
          disabled={isFetching > 0 || isMutating > 0}
        />
      )}
    </div>
  );
}
