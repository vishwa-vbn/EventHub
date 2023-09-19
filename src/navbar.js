import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./navbar.css"; // Import the CSS file

function NavBar({ user }) {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  return (
    <nav className="navbar-container">
      <Link to="/" className="logo">
        EventHub
      </Link>
      <div className="navbar-menu">
        <div className="navbar-links">
          <Link to="/" activeClassName="active">
            Home
          </Link>
          <Link to="/about" activeClassName="active">
            About
          </Link>
          <Link to="/contact" activeClassName="active">
            Contact
          </Link>
          <Link to="/event-upload" activeClassName="active">
            <FontAwesomeIcon icon={faPlus} className="plus-icon" />
            Organize
          </Link>
        </div>
        <button className="profile-btn" onClick={toggleProfile}>
          <img src={user.picture? user.picture:"user.png"} alt="profile" className="profile-img" />
        </button>
        {showProfile && <ProfileBox user={user} />}
      </div>
    </nav>
  );
}

function ProfileBox({ user }) {
  const navigate = useNavigate();


  const logout = () => {
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div className="profile-box">
      <Link to="/profile" activeClassName="active">
        Profile
      </Link>
      <Link to="/dashboard" activeClassName="active">
        Dashboard
      </Link>
      <button className="logout-btn" onClick={logout}>
        Log Out
      </button>
    </div>
  );
}

export default NavBar;
