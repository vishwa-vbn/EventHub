import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = ({ user }) => {
  const [contactNumber, setContactNumber] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Add state for editing mode

  useEffect(() => {
    // Define a function to fetch profile data by email
    const fetchProfileData = async () => {
      try {
        // Make a GET request to fetch profile data based on the user's email
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile/${user.email}`);

        // Check if the response contains a profile object
        if (response.data.profile) {
          const { contactNumber, facebookLink, twitterLink } = response.data.profile;

          // Update the state with the fetched profile data
          setContactNumber(contactNumber || "");
          setFacebookLink(facebookLink || "");
          setTwitterLink(twitterLink || "");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    // Call the fetchProfileData function when the component mounts
    fetchProfileData();
  }, [user]);

  const handleContactNumberChange = (e) => {
    setContactNumber(e.target.value);
  };

  const handleFacebookLinkChange = (e) => {
    setFacebookLink(e.target.value);
  };

  const handleTwitterLinkChange = (e) => {
    setTwitterLink(e.target.value);
  };

  // Function to toggle between edit and save mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Function to handle form submission and saving data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a data object with the user's information
    const userData = {
      name: user.name,
      email: user.email,
      contactNumber,
      facebookLink,
      twitterLink,
    };

    try {
      // Send a POST request to your backend API to save or update the data
      await axios.post(`${process.env.REACT_APP_API_URL}/api/profile`, userData);

      // Toggle back to view mode after successful submission
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <div className="user-info">
        <div>
          <img src={user.picture? user.picture:"user.png"} alt="Profile Pic" />
        </div>
        
      </div>

      {isEditing ? ( 
        
        <>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number:</label>
            <input
              type="text"
              id="contactNumber"
              value={contactNumber}
              onChange={handleContactNumberChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="facebookLink">Facebook Profile Link:</label>
            <input
              type="text"
              id="facebookLink"
              value={facebookLink}
              onChange={handleFacebookLinkChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="twitterLink">Twitter Profile Link:</label>
            <input
              type="text"
              id="twitterLink"
              value={twitterLink}
              onChange={handleTwitterLinkChange}
            />
          </div>
          <button type="submit">Save</button>
        </form>
        </>
      ) : (
        <div>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
          <p>Contact Number: {contactNumber}</p>
          <p>Facebook Profile Link: {facebookLink}</p>
          <p>Twitter Profile Link: {twitterLink}</p>
          <button className="edit-button" onClick={handleEditToggle}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
