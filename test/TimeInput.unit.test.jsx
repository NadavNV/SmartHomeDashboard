import { render, screen, fireEvent } from "@testing-library/react";
import TimeInput from "../src/components/TimeInput";

// Needed to mock alert()
global.alert = jest.fn();

// Mock regex in constants
jest.mock("../constants", () => ({
  TIME_REGEX: /^([01]\d|2[0-3]):[0-5]\d$/, // 24h format HH:mm
}));

describe("TimeInput component", () => {
  const initValue = "12:00";
  const setup = (props = {}) => {
    const onSave = jest.fn();
    render(<TimeInput initValue={initValue} onSave={onSave} {...props} />);
    return { onSave };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays initial value and Edit button", () => {
    setup();
    expect(screen.getByText(initValue)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("switches to input mode when Edit is clicked", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("saves valid input and exits editing mode", () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "23:59" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith("23:59");
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("alerts and stays in edit mode on invalid input", () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "99:99" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(global.alert).toHaveBeenCalledWith("Must enter a valid 24h time");
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toBeInTheDocument(); // Still editing
  });

  it("focuses input when entering editing mode", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.getByRole("textbox");
    expect(document.activeElement).toBe(input);
  });

  it("disables input and button when disabled=true", () => {
    setup({ disabled: true });
    expect(screen.getByRole("button")).toBeDisabled();
    fireEvent.click(screen.getByRole("button")); // Should not enter edit mode
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("pressing Enter triggers save if input is valid", () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "08:30" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onSave).toHaveBeenCalledWith("08:30");
  });
});
