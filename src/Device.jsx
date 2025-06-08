import { useState } from 'react';
import DeviceOptions from './DeviceOptions';
import TextInput from './TextInput';

function Device({ id, type, initDevice, updateDevice }) {
    const [name, setName] = useState(initDevice.name);
    const [status, setStatus] = useState(initDevice.status);
    const [params, setParams] = useState({...initDevice.parameters});
    let statusInput = null;

    function handleStatusChange(device) {
        updateDevice(device);
    }

    switch (type) {
        case 'curtain':
            statusInput = (
                <label>
                    <input 
                        type='checkbox'
                        checked={status === 'open'}
                        onChange={() => {
                            let nextStatus = status === 'open' ? 'closed' : 'open';
                            setStatus(nextStatus);
                            let newDevice = {
                                id: id,
                                type: type,
                                name: name,
                                status: nextStatus,
                                params: params
                            };
                            handleStatusChange(newDevice);
                        }}
                    />
                    Open
                </label>
            );
            break;
        case 'door_lock':
            statusInput = (
                <label>
                    <input 
                        type='checkbox'
                        checked={status === 'locked'}
                        onChange={() => {
                            let nextStatus = status === 'open' ? 'locked' : 'open';
                            setStatus(nextStatus);
                            let newDevice = {
                                id: id,
                                type: type,
                                name: name,
                                status: nextStatus,
                                params: params
                            };
                            handleStatusChange(newDevice);
                        }}
                    />
                    Locked
                </label>
            );
            break;
        default:
            statusInput = (
                <label>
                    <input 
                        type='checkbox'
                        checked={status === 'on'}
                    />
                    On/Off
                </label>
            );
            break;
    }
    return (
        <div id={id}>
            <TextInput
                initValue={name}
                onSave={(newName) => {
                    setName(newName);
                    updateDevice({
                        id: id,
                        type: type,
                        name: newName,
                        status: status,
                        params: params
                    });
                }}
            /> {' '}
            {statusInput} {' '}
            <button>
                Remove
            </button>
            <DeviceOptions
                type={type}
                options={params}
                onSave={(newParams) => {
                    setParams({...newParams});
                    updateDevice({
                        id: id,
                        type: type,
                        name: name,
                        status: status,
                        params: {...newParams}
                    });
                }}
            />
        </div>
    );
}

export default Device;