import { useEffect, useState } from "react";
import "../styles/login.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate=useNavigate();
  console.log("whast this ",process.env)
  const REACT_API_URL = process.env.REACT_APP_API_URL;
  console.log("whats this",REACT_API_URL)
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("user:", username);
    console.log("password:", password);
  }, [username, password]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData={"username":username,
        "password":password
      }
      const response = await axios.post(`${REACT_API_URL}/users/login`, formData);
      const token = response.data.token;
      localStorage.setItem('token', token); 
      localStorage.setItem('IsLoggedIn',true);
      console.log('Login success!');
      navigate("/home");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="login-main">
      <div className="login-center">
        <h2>Welcome</h2>
        <p>Please enter your details</p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <div className="pass-input-div">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-center-buttons">
            <button type="submit" className="button">Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
