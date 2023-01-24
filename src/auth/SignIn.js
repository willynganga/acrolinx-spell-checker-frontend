import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        var data = JSON.stringify({
            username: username,
            password: password,
          });
      
          var config = {
            method: "post",
            url: "https://acrolinx-spell-checker-production.up.railway.app/api/v1/auth/login",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };
      
          const res = await axios(config)
          console.log(res)
        localStorage.setItem("token", res.data.authToken)
        navigate("/home")
            
    }catch(error){
        console.error(error)
    }finally {
        setLoading(false)
    }

    
  };
  return (
    <div className="sign-in-div">
      <h1>Sign In</h1>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>{loading ? "Signing in ..." : "Sign In"}</button>
    </div>
  );
};

export default SignIn;
