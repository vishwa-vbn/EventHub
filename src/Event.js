import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faMapMarkerAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import './EventDetails.css';

const EventCard = ({ event,user }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleReserveSeat = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/reserveSeat`, {
        eventId: event._id,
        userEmail: user.email,
        registered: true,
        eventDate: event.eventDate,
        eventStartTime: event.eventStartTime,
        eventEndTime: event.eventEndTime,
        seatCount: quantity,
      });

      // Add your logic here to handle the response, e.g., show a success message.
      alert('Seat(s) reserved successfully!');
    } catch (error) {
      console.error('Error reserving seat:', error);
      // Add your logic here to handle the error, e.g., show an error message.
      alert('Error reserving seat. Please try again later.');
    }
  };


  const handleRegister = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/registerEvent`, {
        eventId: event._id,
        userEmail: user.email,
        registered: true,
        eventDate: event.eventDate,
        eventStartTime: event.eventStartTime,
        eventEndTime: event.eventEndTime,
      });

      // Add your logic here to handle the response, e.g., show a success message.
      alert('Event registered successfully!');
    } catch (error) {
      console.error('Error registering event:', error);
      // Add your logic here to handle the error, e.g., show an error message.
      alert('Error registering event. Please try again later.');
    }
  };
  


  return (
    <div className="event-card">
      <img src={event.posterImage} alt={event.eventTitle} />

      <div className="event-details">
        <div className="head-cat-desc">
          <div>
            <h1>{event.eventTitle}</h1>
            <p className="event-Date">{event.eventCategory}</p>
          </div>

          {event.isPaidEvent ? (
            event.hasSeatBooking ? (
              <div className="seat-reservation-container">
                <div className="seat-quantity">
                  <label>How many seats to reserve?</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
                <div className="reserve-button">
                  <button onClick={handleReserveSeat}>Reserve Seat Now</button>
                </div>
              </div>
            ) : (
              <div className="registration-box">
                <button onClick={handleRegister}>Register</button>
                {event.candidateLimit > 0 && (
                  <p>Candidate Limit: {event.candidateLimit}</p>
                )}
              </div>
            )
          ) : (
            <div className="free-event-message">
              <p>This is a free event. Open for all. No seat limits.</p>
            </div>
          )}
        </div>

        <div className="date-box">
          <div>
            <FontAwesomeIcon icon={faCalendar} className="icon" />
          </div>
          <p className="event-Date">
            <h3>Date</h3>
            {new Date(event.eventDate).toLocaleDateString()}
          </p>
        </div>

        <div className="time-box">
          <div>
            <FontAwesomeIcon className="icon" icon={faClock} />
          </div>
          <p className="event-time">
            <h3>Time</h3>
            {event.eventStartTime} - {event.eventEndTime}
          </p>
        </div>

        <div className="venue-box">
          <div>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
          </div>
          <p className="event-venue">
            <h3>Venue</h3>
            {event.eventVenue}
          </p>
        </div>
       

        <div className="description">
        <h3>About The Event</h3>
        <p>{event.eventDescription}</p>
        </div>

        <div className="organiser-box">
          <h3>Organiser</h3>
          <p>{event.organizerName}</p>
        </div>

        <div className="estimated-time-box">
          <h3>Estimated Time</h3>
          <p>{event.estimatedTime}</p>
        </div>

        <div className="agenda-box">
          <h3>Agenda</h3>
          <p>{event.agenda}</p>
        </div>

        <div className="ticket-box">
          {event.isPaidEvent && <p>This is a paid event.</p>}
          {event.isOnlineEvent && <p>Mode: Online</p>}
          {!event.isPaidEvent && !event.hasSeatBooking && (
            <p>This is a free event. Open for all. No seat limits.</p>
          )}
        </div>

      </div>
    </div>
  );
};

const EventDetails = ({user}) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getEvents/${id}`);

        // Assuming the response.data is a single event object
        const eventWithImage = {
          ...response.data,
          posterImage: URL.createObjectURL(new Blob([new Uint8Array(response.data.posterImage.data)], { type: 'image/jpeg' })),
        };

        setEvent(eventWithImage);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [id]);

  return (
    <div className="card-main-container2">
      {event ? <EventCard event={event} user={user} /> : <p>Loading event details...</p>}
    </div>
  );
};

export default EventDetails;
