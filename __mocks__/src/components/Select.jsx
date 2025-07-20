import React from "react";

export const mockSelectProps = {};

export default function Select(props) {
  console.log("Mock Select is loaded!");
  mockSelectProps[props.label] = props;
  return <div data-testid="mock-select">Mock Select</div>;
}
