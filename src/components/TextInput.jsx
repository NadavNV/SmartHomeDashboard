import { useState } from "react";

function TextInput({ initValue, onSave, disabled }) {
  const [value, setValue] = useState(initValue);
  const [editing, setEditing] = useState(false);

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
