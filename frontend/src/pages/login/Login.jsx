import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header"; 


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:1111/admin/login", {
        email,
        password,
      });

      console.log("Backend response:", res.data);

      if (res.data.message === "Login muvaffaqiyatli") {
        navigate("/AdminHome"); 
      } else {
        setError(res.data.message || "Login xatolik");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Server bilan bog‘lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
  
    <Header/>
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
    </>
  );
};

export default Login;
