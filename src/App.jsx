import { useState } from 'react';
import DeviceList from './DeviceList';

function App() {
  const [status, setStatus] = useState('init');
  const [devices, setDevices] = useState([]);
  
  function handleFileSelected (e) {
      let fr = new FileReader();
      fr.onload = () => {
          let data = JSON.parse(fr.result);
          setDevices([...data]);
          setStatus('ready');
      };
      fr.readAsText(e.target.files[0]);
  }

  return (
    <>
      { status === 'init' && <h1>Initializing</h1> }
      { status === 'init' && <input type='file' onChange={handleFileSelected}/> }
      { status === 'ready' && <DeviceList initData={devices}/> }
    </>    
  );
}

export default App;
