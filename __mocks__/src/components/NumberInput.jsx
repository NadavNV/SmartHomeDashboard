import React from "react";

export const mockNumberInputProps = {};

export default function NumberInput(props) {
  console.log("Mock NumberInput is loaded!");
  mockNumberInputProps[props.label] = props;
  return <div data-testid="mock-number-input">Mock NumberInput</div>;
}
