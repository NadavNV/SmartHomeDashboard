import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

export default function AuthForm({ onAuth }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = isRegistering
        ? await registerUser(form.username, form.password)
        : await loginUser(form.username, form.password);
      const token = res.token || res.access_token || null;

      if (!token) throw new Error("No token returned from server");
      localStorage.setItem("token", token);
      onAuth(token);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Authentication failed."
      );
    }
  };

  return (
    <div>
      <h1>{isRegistering ? "Register" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:{" "}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:{" "}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>
      <button onClick={toggleMode}>
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>
      <br />
      {error && <p>{error}</p>}
    </div>
  );
}
