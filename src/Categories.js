import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Home.css'; // Import the CSS file for EventComponent

const EventCard = ({ event, onClick }) => {
  return (
    <div className="home-event-card" onClick={onClick}>
      <img src={event.imageUrl} alt={event.eventTitle} />
      <h3>{event.eventTitle}</h3>
      <p>Category: {event.eventCategory}</p>
      <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
    </div>
  );
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getEvents`);

      const eventsWithImages = response.data.map((event) => ({
        ...event,
        imageUrl: URL.createObjectURL(
          new Blob([new Uint8Array(event.posterImage.data)], { type: 'image/jpeg' })
        ),
      }));

      setEvents(eventsWithImages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    return () => {
      // Clean up the resources when the component is unmounted
      events.forEach((event) => URL.revokeObjectURL(event.imageUrl));
    };
  }, [fetchEvents]);

  useEffect(() => {
    // Filter upcoming events based on the event date
    const upcoming = events.filter((event) => {
      const eventDate = new Date(event.eventDate);
      return eventDate >= new Date(); // Include events with dates greater than or equal to today
    });
    setUpcomingEvents(upcoming);

    // Filter recommended events based on their categories
    const recommended = events.filter((event) => {
      const recommendedCategories = ['arts', 'music', 'concert']; // Customize recommended categories here
      return recommendedCategories.includes(event.eventCategory.toLowerCase());
    });
    setRecommendedEvents(recommended);
  }, [events]);

  const handleEventClick = (eventId) => {
    window.location.href = `/event/${eventId}`;
  };

  const filters = [
    'All',
    'Online',
    'Today',
    'Free',
    'Music',
    'Yoga',
    'Tech',
    'Social',
  ];

  const handleCategoryClick = (categoryName) => {
    if (expandedCategory === categoryName) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryName);
    }
  };

  const categories = [
    { name: 'Music' },
    { name: 'Food & Drink' },
    { name: 'Arts' },
    { name: 'Business' },
    { name: 'Health & Wellness' },
    { name: 'Sports & Fitness' },
    // Add more categories as needed
  ];

  const filteredCategories = categories.filter((category) =>
    expandedCategory === null ? true : category.name === expandedCategory
  );

  // Sorting logic based on the selected sorting option
  const sortedCategories = filteredCategories.sort((a, b) => {
    // Add your sorting logic here based on the sortingOption
    // For example, you can sort by date, popularity, etc.
    return 0;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="hero-container">
        <h1 className="hero-slogan">Discover Exciting Events Near You</h1>
        <div className="search-container">
          <input type="text" placeholder="Search events..." />
          <button className="search-btn">Search</button>
        </div>
      </div>
      <div className="card-main-container">
        <div className="categories-container">
          <ul className="category-list">
            {filters.map((filter) => (
              <li key={filter}>
                <button
                  className={`category-button ${expandedCategory === filter ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(filter)}
                >
                  {filter}
                </button>
              </li>
            ))}
          </ul>
          <hr />
          <div className="category-container">
            <h3>Event Categories</h3>
            {sortedCategories.map((category) => (
              <button key={category.name} className="category-btn">
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="event-card-container">
          <h2>Upcoming Events</h2>
          <div className="card-container-box">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} onClick={() => handleEventClick(event._id)} />
            ))}
          </div>
          <h2>Recommended Events</h2>
          <div className="card-container-box">
            {recommendedEvents.map((event) => (
              <EventCard key={event._id} event={event} onClick={() => handleEventClick(event._id)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
