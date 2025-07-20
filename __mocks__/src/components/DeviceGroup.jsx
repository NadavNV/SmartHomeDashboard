import React from "react";

export const mockDeviceGroupProps = {};

export default function DeviceGroup(props) {
  console.log("Mock DeviceGroup is loaded!");
  mockDeviceGroupProps[props.label] = props;
  return <div data-testid="mock-device-group">Mock DeviceGroup</div>;
}
