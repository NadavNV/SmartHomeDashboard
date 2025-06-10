import { useState, useRef, useEffect } from "react";

function TextInput({ initValue, onSave, disabled }) {
  const [value, setValue] = useState(initValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  function handleChange(e) {
    setValue(e.target.value);
  }

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

export default TextInput;
