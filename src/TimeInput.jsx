import {useState} from 'react';

function TimeInput({ initValue, onSave }) {
    const [value, setValue] = useState(initValue);
    const [editing, setEditing] = useState(false);

    function handleChange(e) {
        setValue(e.target.value);
    }

    function verifyValue(text) {
        let regex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
        if (text === null) {
            return false;
        }
        return regex.test(text);
    }

    function handleButtonClick() {
        if (editing) {
            if (verifyValue(value)) {
                setEditing(false);
                onSave(value);
            } else {
                alert('Must enter a valid 24h time');
            }
        } else {
            setEditing(true);
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

export default TimeInput;