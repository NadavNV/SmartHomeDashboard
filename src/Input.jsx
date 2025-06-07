import {useState} from 'react';

export function Input({ type, initValue, onSave }) {
    const [value, setValue] = useState(initValue);
    const [editing, setEditing] = useState(false);

    function handleChange(e) {
        setValue(e.target.value);
    }

    function handleButtonClick() {
        setEditing(!editing);
        if (!editing) {
            onSave();
        }
    }

    return (
        <>
            { editing &&
                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                />
            }
            { !editing && value }
            {' '}
            <button onClick={handleButtonClick}>
                { editing ? 'Save' : 'Edit' }
            </button>
        </>
    )
    
}

export default Input;