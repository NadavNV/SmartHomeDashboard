import React from "react";

export const mockDeviceOptionsProps = {};

export default function DeviceOptions(props) {
  console.log("Mock DeviceOptions is loaded!");
  mockDeviceOptionsProps[props.device_id] = props;
  return <div data-testid="mock-device-options">Mock DeviceOptions</div>;
}
