import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import ProfilePage from "./profile";
import EventSubmissionForm from "./event-upload";
import EventUpdateForm from './EventUpdateForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faRegistered, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

const UserDashboard = ({user}) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [selectedView, setSelectedView] = useState("organized");
  const [showProfile, setShowProfile] = useState(false);
  const [showEventSubmissionForm, setShowEventSubmissionForm] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [otherUsersRegistrations, setOtherUsersRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showYourRegistrations, setShowYourRegistrations] = useState(true);
  const [showUserRegistrations, setShowUserRegistrations] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [eventToUpdate, setEventToUpdate] = useState(null);
  const [organizedEventsSearch, setOrganizedEventsSearch] = useState("");
  const [yourRegistrationsSearch, setYourRegistrationsSearch] = useState("");
  const [userRegistrationsSearch, setUserRegistrationsSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState('');

  const [events, setEvents] = useState([]);

  
  useEffect(() => {
    if (user?.email) {
      const fetchRegisteredEvents = async () => {
        try {
          const url = `${process.env.REACT_APP_API_URL}/registeredEvents`;
          const { data } = await axios.get(url, {
            params: { userEmail: user.email },
            withCredentials: true,
          });
          setRegisteredEvents(data);
        } catch (err) {
          console.log(err);
        }
      };

      const fetchOrganizedEvents = async () => {
        try {
          const url = `${process.env.REACT_APP_API_URL}/organizedEvents/${user.email}`;
          const { data } = await axios.get(url, { withCredentials: true });

          const eventsWithImages = data.map((event) => ({
            ...event,
            imageUrl: URL.createObjectURL(
              new Blob([new Uint8Array(event.posterImage.data)], { type: "image/jpeg" })
            ),
          }));

          setOrganizedEvents(eventsWithImages);
        } catch (err) {
          console.log(err);
        }
      };

      const fetchOtherUsersRegistrations = async () => {
        try {
          const url = `${process.env.REACT_APP_API_URL}/otherUsersRegisteredEvents/${user.email}`;
          const { data } = await axios.get(url, {
            withCredentials: true,
          });
          const validRegistrations = data.filter(item => !item.error);

    setOtherUsersRegistrations(validRegistrations);
        } catch (err) {
          console.log(err);
        }
      };

      fetchRegisteredEvents();
      fetchOrganizedEvents();
      fetchOtherUsersRegistrations();
    }
  }, [user]);

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowEventSubmissionForm(false);
  };

  const toggleEventSubmissionForm = () => {
    setShowEventSubmissionForm((prev) => !prev);
    setShowProfile(false);
  };

  

  const handleRegisteredEventClick = (event) => {
    setSelectedRegistration(event);
  };

  const handleOtherUserEventClick = (event) => {
    setSelectedRegistration(event);
  };

  const handleCloseForm = () => {
    setShowUpdateForm(false);
  };

  const handleEdit = (event) => {
    setEventToUpdate(event);
  };

  const handleUpdateEvent = (updatedEvent) => {
    // Find the index of the event to be updated
    const updatedEventIndex = organizedEvents.findIndex(
      (event) => event.eventId === updatedEvent.eventId
    );

    if (updatedEventIndex !== -1) {
      // Create a new array with the updated event at the correct index
      const updatedEvents = [...organizedEvents];
      updatedEvents[updatedEventIndex] = updatedEvent;

      // Update the organizedEvents state
      setOrganizedEvents(updatedEvents);
    }
  };

  const handleRemove = async (eventId) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/removeEvent/${eventId}`;
      await axios.delete(url);
  
      // Update the organized events list after removing an event
      const updatedOrganizedEvents = organizedEvents.filter((event) => event.eventId !== eventId);
      setOrganizedEvents(updatedOrganizedEvents);
  
      // Update reservations
      const updatedReservations = events.filter((event) => event.eventId !== eventId);
      setEvents(updatedReservations);
      alert("event removed successfully");
    } catch (error) {
      console.error('Error removing event:', error);
      alert('Error removing event. Please try again later.');
    }
  };
  

  const handleUnregister = async (eventId) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/unregisterEvent`;
      await axios.post(url, {
        eventId,
        userEmail: user.email,
      });
  
      // Update the registered events list after unregistering
      const updatedRegisteredEvents = registeredEvents.filter((event) => event.eventId !== eventId);
      setRegisteredEvents(updatedRegisteredEvents);
  
      // Update reservations
      const updatedReservations = events.filter((event) => event.eventId !== eventId);
      setEvents(updatedReservations);
    } catch (error) {
      console.error('Error unregistering for event:', error);
    }
  };
  

  const handleOrganizedEventsSearch = async (event) => {
    const query = event.target.value;
    setOrganizedEventsSearch(query);
  
    try {
      const url = `${process.env.REACT_APP_API_URL}/searchOrganizedEvents/${encodeURIComponent(user.email)}?q=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url, { withCredentials: true });
  
      const eventsWithImages = data.map((event) => ({
        ...event,
        imageUrl: URL.createObjectURL(
          new Blob([new Uint8Array(event.posterImage.data)], { type: "image/jpeg" })
        ),
      }));
  
      setOrganizedEvents(eventsWithImages);
    } catch (error) {
      console.error('Error searching organized events:', error);
    }
  };
  
  const handleYourRegistraionSearch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/searchYourRegisteredEvents/${user.email}?query=${encodeURIComponent(searchQuery)}`,
        { withCredentials: true }
      );
  
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Error fetching matching events');
      }
    } catch (error) {
      console.error('Error fetching matching events:', error);
    }
  };
  // Handle search for "Other Users Registered Events"
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/searchEvents/${user.email}?query=${encodeURIComponent(searchQuery)}`,
        { withCredentials: true }
      );
  
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Error fetching matching events');
      }
    } catch (error) {
      console.error('Error fetching matching events:', error);
    }
  };
  

  return (
    <div className="user-dashboard">
      {/* Side Dashboard */}
      <div className="side-dashboard">
        <div className="dashboard-buttons">
        <button
    className={`dashboard-button ${selectedView === "organized" ? "active" : ""}`}
    onClick={() => {
      setSelectedView("organized");
      setShowProfile(false);
      setShowEventSubmissionForm(false);
    }}
  >
    <FontAwesomeIcon icon={faCalendarAlt} className="dash-icon" />
    Organized Events
  </button>
  <button
    className={`dashboard-button ${selectedView === "registered" ? "active" : ""}`}
    onClick={() => {
      setSelectedView("registered");
      setShowProfile(false);
      setShowEventSubmissionForm(false);
    }}
  >
    <FontAwesomeIcon icon={faRegistered} className="dash-icon" />
    Registered Events
  </button>
  <button className="dashboard-button" onClick={toggleProfile}>
    <FontAwesomeIcon icon={faUser} className="dash-icon" />
    Profile
  </button>
  <button className="dashboard-button" onClick={toggleEventSubmissionForm}>
    <FontAwesomeIcon icon={faPlus} className="dash-icon" />
    Organize
  </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedView === 'organized' && !showProfile && !showEventSubmissionForm && organizedEvents.length === 0 ? (
          <p>No organized events to display.</p>
        ) : selectedView === 'organized' && !showProfile && !showEventSubmissionForm ? (
          <div className="events-table">
          <div className="title-search">
          <h3>Organized Events</h3>
            <input
  type="text"
  className="search-box"
  placeholder="Search organized events..."
  value={organizedEventsSearch} // Assuming you're using organizedEventsSearch as the search query state
  onChange={handleOrganizedEventsSearch}
/>
          </div>
           

            <table>
              <thead>
                <tr>
                  <th>Event Poster</th>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Edit</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {organizedEvents.map((event, index) => (
                  <tr key={index}>
                    <td>
                      <img src={event.imageUrl} alt={event.eventTitle} />
                    </td>
                    <td>{event.eventTitle}</td>
                    <td>
                      <p> {event.eventCategory}</p>
                    </td>
                    <td>
                      <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                    </td>
                    <td>{event.eventStartTime}</td>
                    <td>{event.eventEndTime}</td>
                    <td>
                      <button onClick={() => handleEdit(event)}>Edit</button>
                    </td>
                    <td>
                      <button onClick={() => handleRemove(event._id)}>Remove </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        

      
          
      { selectedView === "registered" && !showProfile && !showEventSubmissionForm ? (
          <div>


            <div className="registration-links">

              <ul>
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      setShowYourRegistrations(true);
                      setShowUserRegistrations(false);
                    }}
                    className={showYourRegistrations ? "active" : ""}
                  >
                    Your Registrations
                  </a>
                </li>
                /
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      setShowYourRegistrations(false);
                      setShowUserRegistrations(true);
                    }}
                    className={showUserRegistrations ? "active" : ""}
                  >
                    User Registrations
                  </a>
                </li>
              </ul>

              <div>

              {showYourRegistrations && (
                <>
                <input
                type="text"
                className="search-box-input"
                 placeholder="Search other users' registered events..."
                 value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                      />
                  <button onClick={handleSearch}
                className="search-box-btn"
                  >Search</button>


                         </>
                         )}

                         {showUserRegistrations && (
                             <>
                        <input
                            type="text"
                className="search-box-input"

                            placeholder="Search other users' registered events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          <button 
                           onClick={handleSearch}
                className="search-box-btn"

                           
                           >Search</button>
                          </>
                    )}
                    </div>
            </div>

            {showYourRegistrations && (
  <div className="user-registered-events">
    <h3>Your Registered Events</h3>
    <table>
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Unregister</th>
        </tr>
      </thead>
      <tbody>
        {(events.length === 0 || events === null)
          ? registeredEvents.map((event) => (
              <tr key={event.eventId}>
                <td>
                  <button onClick={() => handleRegisteredEventClick(event)}>
                    {event.eventName}
                  </button>
                </td>
                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td>{event.eventStartTime}</td>
                <td>{event.eventEndTime}</td>
                <td>
                  <button onClick={() => handleUnregister(event.eventId)}>Unregister</button>
                </td>
              </tr>
            ))
          : events.map((event, index) => (
              <tr key={index}>
                <td>
                  <button onClick={() => handleOtherUserEventClick(event)}>
                    {event.eventName}
                  </button>
                </td>
                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td>{event.eventStartTime}</td>
                <td>{event.eventEndTime}</td>
                <td>
                  <button onClick={() => handleRemove(event._id)}>Remove</button>
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  </div>
)}

            {showUserRegistrations && (
  <div className="organizer-registered-events">
    <h3>Other Users Registered for Your Events</h3>
    {events.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>User Email</th>
            <th>Seats Booked</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>
                <button onClick={() => handleOtherUserEventClick(event)}>
                  {event.eventName}
                </button>
              </td>
              <td>{new Date(event.eventDate).toLocaleDateString()}</td>
              <td>{event.eventStartTime}</td>
              <td>{event.eventEndTime}</td>
              <td>{event.userEmail}</td>
              <td>{event.seatsBooked}</td>
              <td>
                <button onClick={() => handleRemove(event._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : otherUsersRegistrations.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>User Email</th>
            <th>Seats Booked</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {otherUsersRegistrations.map((registration, index) => (
            <tr key={index}>
              <td>
                <button onClick={() => handleOtherUserEventClick(registration)}>
                  {registration.eventName}
                </button>
              </td>
              <td>{new Date(registration.eventDate).toLocaleDateString()}</td>
              <td>{registration.eventStartTime}</td>
              <td>{registration.eventEndTime}</td>
              <td>{registration.userEmail}</td>
              <td>{registration.seatsBooked}</td>
              <td>
                <button onClick={() => handleRemove(registration._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No other users registered for your events yet.</p>
    )}
  </div>
)}

          </div>
        ) : null}

        {showProfile && (
          <div className="profile-section">
            <ProfilePage user={user} />
          </div>
        )}

        {showEventSubmissionForm && (
          <div className="event-submission-section">
            <EventSubmissionForm user={user} />
          </div>
        )}
      </div>

      {eventToUpdate && (
        <EventUpdateForm
          user={user}
          event={eventToUpdate}
          onCloseForm={() => setEventToUpdate(null)}
          onUpdateEvent={handleUpdateEvent}
        />
      )}
    </div>
  );
};

export default UserDashboard;
