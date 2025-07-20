import { render, screen, fireEvent } from "@testing-library/react";
import TimeInput from "src/components/TimeInput";

// Needed to mock alert()
global.alert = vi.fn();

// Mock regex in constants
vi.mock("../src/constants", () => ({
  TIME_REGEX: /^([01]\d|2[0-3]):[0-5]\d$/, // 24h format HH:mm
}));

describe("TimeInput component", () => {
  const initValue = "12:00";
  const setup = (props = { label: "test" }) => {
    const onSave = vi.fn();
    render(<TimeInput initValue={initValue} onSave={onSave} {...props} />);
    return { onSave };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays initial value and Edit button", () => {
    setup();
    expect(screen.getByText(new RegExp(initValue))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("switches to input mode when Edit is clicked", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("saves valid input and exits editing mode", () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "23:59" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith("23:59");
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("alerts and stays in edit mode on invalid input", () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "99:99" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(global.alert).toHaveBeenCalledWith("Must enter a valid 24h time");
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toBeInTheDocument(); // Still editing
  });

  it("focuses input when entering editing mode", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
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
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "08:30" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onSave).toHaveBeenCalledWith("08:30");
  });
});
