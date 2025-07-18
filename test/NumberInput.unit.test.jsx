import { render, screen, fireEvent } from "@testing-library/react";
import NumberInput from "../src/components/NumberInput";

// Needed to mock alert()
global.alert = jest.fn();

describe("TimeInput component", () => {
  const initValue = 12;
  const setup = (props = {}) => {
    const onSave = jest.fn();
    render(<NumberInput initValue={initValue} onSave={onSave} {...props} />);
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
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("saves valid input and exits editing mode", () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: 59 } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith(59);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("alerts and stays in edit mode on invalid input - only max", () => {
    const { onSave } = setup({ max: 50 });
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: 99 } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(global.alert).toHaveBeenCalledWith(
      "Must enter a number lower than 50"
    );
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument(); // Still editing
  });

  it("alerts and stays in edit mode on invalid input - only min", () => {
    const { onSave } = setup({ max: 50 });
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: 49 } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(global.alert).toHaveBeenCalledWith(
      "Must enter a number greater than 50"
    );
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument(); // Still editing
  });

  it("alerts and stays in edit mode on invalid input - min and max", () => {
    const { onSave } = setup({ min: 30, max: 50 });
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: 51 } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(global.alert).toHaveBeenCalledWith(
      "Must enter a nunmber between 30 and 50"
    );
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("spinbutton")).toBeInTheDocument(); // Still editing
  });

  it("focuses input when entering editing mode", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.getByRole("spinbutton");
    expect(document.activeElement).toBe(input);
  });

  it("disables input and button when disabled=true", () => {
    setup({ disabled: true });
    expect(screen.getByRole("button")).toBeDisabled();
    fireEvent.click(screen.getByRole("button")); // Should not enter edit mode
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("pressing Enter triggers save if input is valid", () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: 8 } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onSave).toHaveBeenCalledWith(8);
  });
});
