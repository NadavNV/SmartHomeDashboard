import Device from './Device';

export function DeviceList( { data }) {
    const devices = data.map(device => {
        return (
            <li key={device.id}>
                <Device
                    id={device.id}
                    type={device.type}
                    initDevice={{
                        name: device.name,
                        status: device.status,
                        parameters: {...device.parameters}
                    }}
                    updateDevice={(device) => {
                        console.log('Updating device:');
                        console.log(device);
                    }}  
                />
                <br />
            </li>
        );
    });

    return (
        <ul>
            {devices}
        </ul>
    );
}


export default DeviceList;