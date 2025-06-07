// import { useState } from 'react';
import Input from './Input'

export function Device({ id, type, name, status, params }) {
    let options = null;
    switch (type) {
        case 'water_heater':
            options = (
                <>
                    Temperature: {params.temperature}
                    {' '}
                    Target temperature: {params.target_temperature}
                    {' '}
                    <button>
                        Edit
                    </button>
                    {' '}
                    <label>
                        <input
                            type='checkbox'
                            checked={params.timer_enabled}
                        />
                        Timer enabled
                    </label>
                    {' Start time '}
                     
                    <Input
                        type='text'
                        initValue={params.scheduled_on}
                        onSave={() => null}
                    />
                    {' Stop time '}
                    <Input
                        type='text'
                        initValue={params.scheduled_off}
                        onSave={() => null}
                    />                    
                </>
            );
            break;
        default:
            break;
    }
    return (
        <div id={id}>
            <button>
                Remove
            </button>
            {' ' + name + ' '}
            <label>
                <input 
                    type='checkbox'
                    checked={status === 'on'}
                />
                On/Off
            </label>
            {' '}
            {options}
        </div>

    )
}

export default Device;