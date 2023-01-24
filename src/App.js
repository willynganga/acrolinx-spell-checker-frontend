import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SignIn from "./auth/SignIn";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<SignIn />} />
      </Routes>
      </Router>
      
  )
}

export default App;
