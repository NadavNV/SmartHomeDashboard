import { useState } from "react";
import DeviceList from "src/components/DeviceList";
import AuthForm from "src/components/AuthForm";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "fit-content",
      }}
    >
      {token ? (
        <DeviceList onLogout={logout} />
      ) : (
        <AuthForm onAuth={setToken} />
      )}
    </div>
  );
}
