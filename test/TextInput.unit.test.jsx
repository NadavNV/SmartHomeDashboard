import { render, screen, fireEvent } from "@testing-library/react";
import TextInput from "src/components/TextInput";

describe("TextInput component", () => {
  const initValue = "David";
  const setup = (props = {}) => {
    const onSave = vi.fn();
    render(<TextInput initValue={initValue} onSave={onSave} {...props} />);
    return { onSave };
  };

  beforeEach(() => {
    vi.clearAllMocks();
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
    fireEvent.change(input, { target: { value: "Steve" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith("Steve");
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
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
