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
}) {
  // The current value
  const [value, setValue] = useState(initValue);
  // Whether or not the component is in editing mode
  const [editing, setEditing] = useState(false);
  // Points to the input component, used for focusing it when entering edit mode
  const inputRef = useRef(null);

  // Focus the input component when entering edit mode
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  function handleChange(e) {
    setValue(e.target.value);
  }

  // Enter or exit editing mode
  function handleButtonClick() {
    setEditing(!editing);
    if (editing) {
      onSave(value);
    }
  }

  return (
    <>
      {editing && (
        <input
          ref={inputRef}
          disabled={disabled}
          type="text"
          value={value}
          onChange={handleChange}
        />
      )}
      {!editing && value}{" "}
      <button disabled={disabled} onClick={handleButtonClick}>
        {editing ? "Save" : "Edit"}
      </button>
    </>
  );
}
