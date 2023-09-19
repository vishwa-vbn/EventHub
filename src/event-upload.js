import React, { useState } from 'react';
import axios from 'axios';
import './eventUpload.css';

const EventSubmissionForm = ({ user }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('All');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isPaidEvent, setIsPaidEvent] = useState(false);
  const [isOnlineEvent, setIsOnlineEvent] = useState(false);
  const [posterImage, setPosterImage] = useState(null);
  const [organizerName, setOrganizerName] = useState('');

  const [hasSeatBooking, setHasSeatBooking] = useState(false);
  const [seatLimit, setSeatLimit] = useState(0);
  const [provideRegistrationLink, setProvideRegistrationLink] = useState(false);
  const [candidateLimit, setCandidateLimit] = useState(0);

  const categories = [
    { name: 'All' },
    { name: 'Music' },
    { name: 'Food & Drink' },
    { name: 'Art' },
    { name: 'Culture' },
    { name: 'Business' },
    { name: 'Health' },
    { name: 'Wellness' },
    { name: 'Sports' },
    { name: 'Technology' },
    // Add more categories as needed
  ];

  const handleSeatBookingChange = (e) => {
    setHasSeatBooking(e.target.checked);
  };

  const handleSeatLimitChange = (e) => {
    setSeatLimit(Number(e.target.value));
  };

  const handleProvideRegistrationLinkChange = (e) => {
    setProvideRegistrationLink(e.target.checked);
  };

  const handleCandidateLimitChange = (e) => {
    setCandidateLimit(Number(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('eventTitle', eventTitle);
      formDataToSubmit.append('eventDescription', eventDescription);
      formDataToSubmit.append('eventCategory', eventCategory);
      formDataToSubmit.append('eventVenue', eventVenue);
      formDataToSubmit.append('eventDate', eventDate);
      formDataToSubmit.append('eventStartTime', eventStartTime);
      formDataToSubmit.append('eventEndTime', eventEndTime);
      formDataToSubmit.append('estimatedTime', estimatedTime);
      formDataToSubmit.append('agenda', agenda);
      formDataToSubmit.append('isPaidEvent', isPaidEvent);
      formDataToSubmit.append('isOnlineEvent', isOnlineEvent);
      formDataToSubmit.append('organizerName', organizerName);
      formDataToSubmit.append('posterImage', posterImage);
      formDataToSubmit.append('hasSeatBooking', hasSeatBooking);
      formDataToSubmit.append('seatLimit', hasSeatBooking ? seatLimit : 0);
      formDataToSubmit.append('provideRegistrationLink', provideRegistrationLink);
      formDataToSubmit.append('candidateLimit', provideRegistrationLink ? candidateLimit : 0);
      if (user && user.email) {
        formDataToSubmit.append('userEmail', user.email);
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/eventUpload`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Event submitted successfully!');
        // Reset the form after successful submission
        setEventTitle('');
        setEventDescription('');
        setEventCategory('All');
        setEventVenue('');
        setEventDate('');
        setEventStartTime('');
        setEventEndTime('');
        setEstimatedTime('');
        setAgenda('');
        setIsPaidEvent(false);
        setIsOnlineEvent(false);
        setPosterImage(null);
        setOrganizerName('');
      } else {
        alert('Failed to submit event');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Error submitting event. Please try again later.');
    }
  };

  return (
    <div className="event-submission-form">
     <div className="form-intro">
        <h2>Submit Your Event</h2>
        <p>Follow the steps below to submit your event. Please provide accurate information to ensure successful event registration.</p>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-column">
          <div className="form-group">
            <label>Event Title</label>
            <input type="text" name="eventTitle" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Event Description</label>
            <input type="text" name="eventDescription" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Event Category</label>
            <select name="eventCategory" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Event Venue</label>
            <input type="text" name="eventVenue" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Organizer Name</label>
            <input type="text" name="organizerName" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Event Poster</label>
            <div className="poster-preview">
              {posterImage && <img src={URL.createObjectURL(posterImage)} alt="Event Poster Preview" />}
            </div>
            <input type="file" name="posterImage" onChange={(e) => setPosterImage(e.target.files[0])} />
          </div>
        </div>

        <div className="form-column">
          <div className="form-group">
            <label>Event Date</label>
            <input type="Date" name="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Event Start Time</label>
            <input type="time" name="eventStartTime" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Event End Time</label>
            <input type="time" name="eventEndTime" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Estimated Time</label>
            <input type="text" name="estimatedTime" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Agenda</label>
            <textarea name="agenda" value={agenda} onChange={(e) => setAgenda(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label>Has Seat Booking (Offline Events)</label>
            <input
              type="checkbox"
              name="hasSeatBooking"
              checked={hasSeatBooking}
              onChange={handleSeatBookingChange}
            />
          </div>
          {hasSeatBooking && (
            <div className="form-group">
              <label>Number of Seats Available</label>
              <input
                type="number"
                name="seatLimit"
                value={seatLimit}
                onChange={handleSeatLimitChange}
              />
            </div>
          )}
          <div className="form-group">
            <label>Provide Registration Link (Online Events)</label>
            <input
              type="checkbox"
              name="provideRegistrationLink"
              checked={provideRegistrationLink}
              onChange={handleProvideRegistrationLinkChange}
            />
          </div>
          {provideRegistrationLink && (
            <div>
              <div className="form-group">
                <label>Candidates Registration Seat Limit</label>
                <input
                  type="number"
                  name="candidateLimit"
                  value={candidateLimit}
                  onChange={handleCandidateLimitChange}
                />
              </div>
            </div>
          )}
          <div className="form-group">
            <label>Is Paid Event</label>
            <input type="checkbox" name="isPaidEvent" checked={isPaidEvent} onChange={(e) => setIsPaidEvent(e.target.checked)} />
          </div>
          <div className="form-group">
            <label>Is Online Event</label>
            <input type="checkbox" name="isOnlineEvent" checked={isOnlineEvent} onChange={(e) => setIsOnlineEvent(e.target.checked)} />
          </div>
          <div className="form-group">
            <button type="submit">Submit Event</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventSubmissionForm;
