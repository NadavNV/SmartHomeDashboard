import { useState, Fragment /*, useEffect*/ } from 'react';
import Device from './Device';

export function DeviceList() {
    const [devicesList, setDevicesList] = useState([]);
    const [status, setStatus] = useState('loading');
    const devices = devicesList.map(device => {
        return (
            <Fragment key={device.id}>
                <Device
                    id={device.id}
                    type={device.type}
                    name={device.name}
                    status={device.status}
                    params={device.parameters}
                />
                <br />
            </Fragment>
        );
    });

    function handleFileSelected (e) {
        let fr = new FileReader();
        fr.onload = () => {
            let data = JSON.parse(fr.result);
            console.log(data);
            setDevicesList([...data]);
            setStatus('ready');
        };
        fr.readAsText(e.target.files[0]);
    }

    return (
        <>
            {status === 'loading' && <h1>Loading...</h1>}
            {status === 'loading' && <input type='file' onChange={handleFileSelected}/>}
            {status === 'ready' && devices}
        </>
    );
}


export default DeviceList;