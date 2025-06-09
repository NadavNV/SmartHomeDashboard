import DeviceList from "./components/DeviceList";
import { useDevices } from "./services/queries";

function App() {
  const devicesQuery = useDevices();

  if (devicesQuery.isPending) {
    return <h1>Loading...</h1>;
  }

  if (devicesQuery.isError) {
    console.log(devicesQuery.error);
    return <h1>An error occurred</h1>;
  }

  return <DeviceList />;
}

export default App;
