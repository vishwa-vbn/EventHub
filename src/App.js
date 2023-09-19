import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Signup from "./Register";
import NavBar from "./navbar";
import EventUpload from './event-upload';
import EventDetails from "./Event";
import UserDashboard from './dashbord'; 
import UserProfile from './profile';
import { useNavigate } from "react-router-dom";
import { auth } from "./config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already signed in using localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setValue(storedUser.email);
      setUser(storedUser);
      // You can fetch additional user data here if needed
    }
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = {
        name: result.user.displayName,
        email: result.user.email,
        picture: result.user.picture,
      };
      console.log("User Data:", user);
      // Store the user object in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      
      setValue(user.email);
      setUser(user);
  
      // You can fetch additional user data here if needed
      navigate("/"); // Redirect to the home route after successful login
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="sign-container">
      {!value ? (
        <div className="login-box">
        <h1 className="signin-heading">Sign in</h1>

           <img src="login.jpg" className="login-icon" alt=" Icon" />

      
          <p className="instructions">
          To participate or organize events.
        </p>
          <button onClick={handleSignIn} className="google-signin-button">
            <img src="google.png" className="google-icon" alt="Google Icon" />
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <NavBar user={user} />
          <Routes>
            <Route
              exact
              path="/"
              element={<Home user={user} />}
            />
            <Route
              exact
              path="/event-upload"
              element={<EventUpload user={user} />}
            />
            <Route exact path="/dashboard" element={<UserDashboard user={user} />} /> 
            <Route exact path="/profile" element={<UserProfile user={user} />} />
            <Route path="/event/:id" element={<EventDetails user={user} />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
