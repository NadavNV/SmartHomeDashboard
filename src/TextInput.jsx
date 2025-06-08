import {useState} from 'react';

function TextInput({ initValue, onSave }) {
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
            { editing &&
                <input
                    type='text'
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

export default TextInput;