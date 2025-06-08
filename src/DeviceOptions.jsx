import TextInput from './TextInput';
import TimeInput from './TimeInput';
import NumberInput from './NumberInput';

function DeviceOptions({ type, options, onSave }) {
    console.log(type, options);
    switch (type) {
        case 'water_heater':
            return (
                <ul>
                    <li>
                        Temperature: {options.temperature}
                        {' Target temperature: '}
                        <NumberInput
                            initValue={options.target_temperature}
                            onSave={(newTemperature) => {
                                onSave({
                                    ...options,
                                    target_temperature: newTemperature
                                });
                            }}
                        />
                    </li>
                    <li>
                        <label>
                            <input
                                type='checkbox'
                                checked={options.timer_enabled}
                                onChange={() => {
                                    onSave({
                                        ...options,
                                        timer_enabled: !options.timer_enabled
                                    });
                                }}
                            />
                            Timer enabled
                        </label>
                        {' Start time '}                        
                        <TimeInput
                            initValue={options.scheduled_on}
                            onSave={(newTime) => {
                                onSave({
                                    ...options,
                                    scheduled_on: newTime
                                })
                            }}
                        />
                        {' Stop time '}
                        <TimeInput
                            initValue={options.scheduled_off}
                            onSave={(newTime) => {
                                onSave({
                                    ...options,
                                    scheduled_off: newTime
                                })
                            }}
                        />               
                    </li>     
                </ul>
            );
        case 'light':
            return (
                <ul>

                </ul>
            );
        default:
            return null;
    }

}

export default DeviceOptions;