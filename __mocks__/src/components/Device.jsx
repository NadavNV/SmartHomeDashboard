import React from "react";

export const mockDeviceProps = {};

export default function Device(props) {
  console.log("Mock Device is loaded!");
  mockDeviceProps[props.id] = props;
  return <div data-testid="mock-device">Mock Device</div>;
}
