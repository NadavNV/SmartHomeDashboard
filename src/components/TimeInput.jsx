import { useState, useRef, useEffect } from "react";

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

  function verifyValue(text) {
    // ([01]?\d|2[0-3]) - Hours. Either a 2 followed by 0-3 or an optional
    //                    initial digit of 0 or 1 follwed by any digit.
    // :? - Optional colon.
    // ([0-5]\d) - Minutes, 0-5 followed by any digit.
    let regex = /^([01]?\d|2[0-3]):?([0-5]\d)$/;
    if (text === null) {
      return false;
    }
    return regex.test(text);
  }

  // Verify the current value and either enter or exit editing mode
  function handleButtonClick() {
    if (editing) {
      if (verifyValue(value)) {
        setEditing(false);
        onSave(value);
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
