import React from "react";

export const mockTimeInputProps = {};

export default function TimeInput(props) {
  console.log("Mock TimeInput is loaded!");
  mockTimeInputProps[props.label] = props;
  return <div data-testid="mock-time-input">Mock TimeInpur</div>;
}
