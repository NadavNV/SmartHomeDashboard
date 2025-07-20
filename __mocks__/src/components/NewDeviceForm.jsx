import React from "react";

export const mockDeviceFormProps = [];

export default function NewDeviceForm(props) {
  console.log("Mock NewDeviceForm is loaded!");
  mockDeviceFormProps.push(props);
  return <div data-testid="mock-new-device-form">Mock NewDeviceForm</div>;
}
