import { useState } from "react";

function NumberInput({
  initValue,
  min = -Infinity,
  max = Infinity,
  onSave,
  disabled,
}) {
  const [value, setValue] = useState(initValue);
  const [editing, setEditing] = useState(false);

  function handleChange(e) {
    setValue(e.target.value);
  }

  function verifyValue(number) {
    return min <= number && number <= max;
  }

  function handleButtonClick() {
    if (editing) {
      if (verifyValue(value)) {
        setEditing(false);
        onSave(value);
      } else {
        if (min !== -Infinity && max !== Infinity) {
          alert(`Must enter a nunmber between ${min} and ${max}`);
        } else if (min === -Infinity) {
          alert(`Must enter a number lower than ${max}`);
        } else {
          alert(`Must enter a number greater than ${min}`);
        }
      }
    } else {
      setEditing(true);
    }
  }

  return (
    <>
      {editing && (
        <input
          disabled={disabled}
          type="number"
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

export default NumberInput;
