import React from "react";

export const mockTextInputProps = {};

export default function TextInput(props) {
  console.log("Mock TextInput is loaded!");
  mockTextInputProps[props.label] = props;
  return <div data-testid="mock-text-input">Mock TextInput</div>;
}
