import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './eventUpdateForm.css';

const EventUpdateForm = ({ user, event, onCloseForm, onUpdateEvent }) => {
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

  useEffect(() => {
    // Set the initial state with the event data if available
    if (event) {
      setEventTitle(event.eventTitle);
      setEventDescription(event.eventDescription);
      setEventCategory(event.eventCategory);
      setEventVenue(event.eventVenue);
      
      const formattedEventDate = new Date(event.eventDate).toISOString().split('T')[0];
      setEventDate(formattedEventDate);
      setEventStartTime(event.eventStartTime);
      setEventEndTime(event.eventEndTime);
      setEstimatedTime(event.estimatedTime);
      setAgenda(event.agenda);
      setIsPaidEvent(event.isPaidEvent);
      setIsOnlineEvent(event.isOnlineEvent);
      setOrganizerName(event.organizerName);
      // Since posterImage is a file, it cannot be set using useState directly.
      // You may need to handle file input separately if you want to update the poster image.
    }
  }, [event]);

  const handleImageChange = (e) => {
    // Handle file input change
    const file = e.target.files[0];
    setPosterImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new FormData to include the poster image as a file
      const formData = new FormData();
      formData.append('eventTitle', eventTitle);
      formData.append('eventDescription', eventDescription);
      formData.append('eventCategory', eventCategory);
      formData.append('eventVenue', eventVenue);
      formData.append('eventDate', eventDate);
      formData.append('eventStartTime', eventStartTime);
      formData.append('eventEndTime', eventEndTime);
      formData.append('estimatedTime', estimatedTime);
      formData.append('agenda', agenda);
      formData.append('isPaidEvent', isPaidEvent);
      formData.append('isOnlineEvent', isOnlineEvent);
      formData.append('organizerName', organizerName);
  
      // Add the poster image if available
      if (posterImage) {
        formData.append('posterImage', posterImage);
      }
  
      // Make API call to update the event with the new data
      // Make API call to update the event with the new data
const url = `${process.env.REACT_APP_API_URL}/updateEvent/${event._id}`;
await axios.post(url, formData);

// Create a copy of the updated event
const updatedEvent = {
  ...event,
  ...formData,
};

// Call the onUpdateEvent callback to update the event in the parent component's state
onUpdateEvent(updatedEvent);

        alert('event updated successfully');
      onCloseForm();
      window.location.reload();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event. Please try again later.');
    }
  };

  return (
    <div className="event-update-form-container">
      <div className="event-update-form">
        <form onSubmit={handleSubmit}>
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
                <option value="All">All</option>
                <option value="Music">Music</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Art">Art</option>
                <option value="Culture">Culture</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Wellness">Wellness</option>
                <option value="Sports">Sports</option>
                <option value="Technology">Technology</option>
                {/* Add more categories as needed */}
              </select>
            </div>
            <div className="form-group">
              <label>Event Venue</label>
              <input type="text" name="eventVenue" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Event Date</label>
              <input type="date" name="eventDate" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Event Start Time</label>
              <input type="time" name="eventStartTime" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />
            </div>
          </div>

          <div className="form-column">
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
              <label>Is Paid Event</label>
              <input type="checkbox" name="isPaidEvent" checked={isPaidEvent} onChange={(e) => setIsPaidEvent(e.target.checked)} />
            </div>
            <div className="form-group">
              <label>Is Online Event</label>
              <input type="checkbox" name="isOnlineEvent" checked={isOnlineEvent} onChange={(e) => setIsOnlineEvent(e.target.checked)} />
            </div>
            <div className="form-group">
              <label>Organizer Name</label>
              <input type="text" name="organizerName" value={organizerName} onChange={(e) => setOrganizerName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Poster Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
             <div className="form-group">
            <button type="submit">Update Event</button>
            <button type="button" onClick={onCloseForm}>Cancel</button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventUpdateForm;
