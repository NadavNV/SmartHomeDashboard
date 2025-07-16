import { useState, useRef, useEffect } from "react";
import { TIME_REGEX } from "../constants";

// React component that either displays an text input field when in editing
// mode or displays the current value when in non-editing mode. Only accepts
// times in 24hr format as valid values.
export default function TimeInput({
  // Initial value
  initValue,
  // Function to be called when exiting editing mode, recieves the new value
  // as its only argument
  onSave,
  // Whether or not to disable interactivity
  disabled,
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

  function verifyValue(text) {
    let regex = TIME_REGEX;
    if (text === null) {
      return false;
    }
    return regex.test(text);
  }

  // Verify the current value and either enter or exit editing mode
  function handleButtonClick() {
    if (editing) {
      if (verifyValue(inputRef.current.value)) {
        setEditing(false);
        onSave(inputRef.current.value);
      } else {
        alert("Must enter a valid 24h time");
      }
    } else {
      setEditing(true);
    }
  }

  return (
    <>
      {editing && (
        <input
          ref={inputRef}
          disabled={disabled}
          type="text"
          defaultValue={initValue}
        />
      )}
      {!editing &&
        (inputRef.current === null ? initValue : inputRef.current.value)}{" "}
      <button disabled={disabled} onClick={handleButtonClick}>
        {editing ? "Save" : "Edit"}
      </button>
    </>
  );
}
