import { useState, useRef, useEffect } from "react";

// React component that either displays an text input field when in editing
// mode or displays the current value when in non-editing mode.
export default function TextInput({
  // Initial value
  initValue,
  // Function to be called when exiting editing mode, recieves the new value
  // as its only argument
  onSave,
  // Whether or not to disable interactivity
  disabled,
  // Label for the text input
  label,
}) {
  // Whether or not the component is in editing mode
  const [editing, setEditing] = useState(false);
  // Points to the input component
  const inputRef = useRef(null);

  // Focus the input component when entering edit mode
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  // Enter or exit editing mode
  function handleButtonClick() {
    setEditing(!editing);
    if (editing) {
      onSave(inputRef.current.value);
    }
  }

  return (
    <>
      <label>
        {label}
        {editing && (
          <input
            ref={inputRef}
            disabled={disabled}
            type="text"
            defaultValue={initValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleButtonClick();
              }
            }}
          />
        )}
        {!editing &&
          (inputRef.current === null ? initValue : inputRef.current.value)}{" "}
      </label>
      <button
        disabled={disabled}
        onClick={handleButtonClick}
        aria-label={`${editing ? "Save" : "Edit"} ${label}`}
      >
        {editing ? "Save" : "Edit"}
      </button>
    </>
  );
}
