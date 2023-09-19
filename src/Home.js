import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Home.css';

const EventCard = React.memo(({ event, onClick }) => {
  
  
 
  
  return (
    <div className="home-event-card" onClick={onClick}>
      <img src={event.imageUrl} alt={event.eventTitle} />
      <h3>{event.eventTitle}</h3>
      <p>Category: {event.eventCategory}</p>
      <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
      <input type="hidden" value={event.isPaidEvent} />
      <input type="hidden" value={event.isOnlineEvent} />
      <input type="hidden" value={event.eventDate} />
    </div>
  );
});

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllEvents, setShowAllEvents] = useState(true);
  const [showUpcomingEvents, setShowUpcomingEvents] = useState(false);
  const [showFreeEvents, setShowFreeEvents] = useState(false);
  const [showOnlineEvents, setShowOnlineEvents] = useState(false);
  const [showTodayEvents, setShowTodayEvents] = useState(false);

  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(false);
  const [isRecommendedExpanded, setIsRecommendedExpanded] = useState(false);
  const [eventsToShow, setEventsToShow] = useState(1);
  const [recommendedEvents, setRecommendedEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getEvents`);

      const eventsWithImages = response.data.map((event) => ({
        ...event,
        imageUrl: URL.createObjectURL(new Blob([new Uint8Array(event.posterImage.data)], { type: 'image/jpeg' })),
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
      events.forEach((event) => URL.revokeObjectURL(event.imageUrl));
    };
  }, [fetchEvents]);

  useEffect(() => {
    // ... Other filtering logic ...

    // Randomly select and set recommended events
    const numberOfRecommendedEvents = 4; // You can adjust this number as per your requirement
    const shuffledEvents = filteredEvents.sort(() => 0.5 - Math.random());
    const selectedRecommendedEvents = shuffledEvents.slice(0, numberOfRecommendedEvents);
    setRecommendedEvents(selectedRecommendedEvents);
  }, [events, showAllEvents, showUpcomingEvents, showFreeEvents, showOnlineEvents, showTodayEvents, selectedCategory, searchQuery, filteredEvents]);

  useEffect(() => {
    // Filter events based on showFreeEvents, showOnlineEvents, and showTodayEvents flags
    const filtered = events.filter((event) => {
      const isFree = event.isPaidEvent === false;
      const isOnline = event.isOnlineEvent === true;
      const isToday = new Date(event.eventDate).toDateString() === new Date().toDateString();
      return (
        (showAllEvents || showUpcomingEvents) ||
        (showFreeEvents && isFree) ||
        (showOnlineEvents && isOnline) ||
        (showTodayEvents && isToday)
      );
    });

    // Apply additional filters (category and search query)
    const filteredAndSorted = filtered.filter(
      (event) =>
        eventMatchesSearchQuery(event, searchQuery) &&
        (selectedCategory === 'All' || event.eventCategory.toLowerCase() === selectedCategory.toLowerCase())
    );

    setFilteredEvents(filteredAndSorted);
  }, [events, showAllEvents, showUpcomingEvents, showFreeEvents, showOnlineEvents, showTodayEvents, selectedCategory, searchQuery]);

  const handleEventClick = (eventId) => {
    window.location.href = `/event/${eventId}`;
  };

  const eventMatchesSearchQuery = (event, query) => {
    const lowercaseQuery = query.toLowerCase().trim();
    return (
      event.eventTitle.toLowerCase().includes(lowercaseQuery) ||
      event.eventCategory.toLowerCase().includes(lowercaseQuery)
    );
  };

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

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchQuery('');
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterClick = (filterName) => {
    setShowAllEvents(false);
    setShowUpcomingEvents(false);
    setShowFreeEvents(false);
    setShowOnlineEvents(false);
    setShowTodayEvents(false);

    if (filterName === 'All') {
      setShowAllEvents(true);
    } else if (filterName === 'Upcoming') {
      setShowUpcomingEvents(true);
    } else if (filterName === 'Free') {
      setShowFreeEvents(true);
    } else if (filterName === 'Online') {
      setShowOnlineEvents(true);
    } else if (filterName === 'Today') {
      setShowTodayEvents(true);
    }
  };

  const handleToggleUpcomingExpand = () => {
    setIsUpcomingExpanded((prevExpanded) => !prevExpanded);
  };
  
  const handleToggleRecommendedExpand = () => {
    setIsRecommendedExpanded((prevExpanded) => !prevExpanded);
  };
  

  if (loading) {
    return (
      <>
        <div className="home-container">
          <div className="hero-container loading-skeleton">
            <h1 className="hero-slogan"></h1>
            <div className="search-container loading-skeleton">
            </div>
          </div>

          <div className="main-container">
            <div className="filters-container loading-skeleton">
              <button className="filter-btn"></button>
              <button className="filter-btn"></button>
              {/* Add more loading buttons as needed */}
            </div>

            <div className="categories-section loading-skeleton">
              <h2>Loading</h2>
              <div className="category-container">
                <button className="category-btn"></button>
                <button className="category-btn"></button>
                {/* Add more loading buttons as needed */}
              </div>
            </div>

            <div className="event-card-section loading-skeleton">
              <h2></h2>
              <div className="view-all-link"></div>
              <div className={`card-container-box expanded`}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="home-event-card loading-skeleton" />
                ))}
              </div>
            </div>

            <div className="event-card-section loading-skeleton">
              <h2></h2>
              <div className="view-all-link"></div>
              <div className={`card-container-box expanded`}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="home-event-card loading-skeleton" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="home-container">
        <div className="hero-container">
          <h1 className="hero-slogan">Discover Exciting Events Near You</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>

        <div className="main-container">
          <div className="filters-container">
            <button
              className={`filter-btn ${showAllEvents ? 'active' : ''}`}
              onClick={() => handleFilterClick('All')}
            >
              All
            </button>
            <button
              className={`filter-btn ${showUpcomingEvents ? 'active' : ''}`}
              onClick={() => handleFilterClick('Upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`filter-btn ${showFreeEvents ? 'active' : ''}`}
              onClick={() => handleFilterClick('Free')}
            >
              Free
            </button>
            <button
              className={`filter-btn ${showOnlineEvents ? 'active' : ''}`}
              onClick={() => handleFilterClick('Online')}
            >
              Online
            </button>
            <button
              className={`filter-btn ${showTodayEvents ? 'active' : ''}`}
              onClick={() => handleFilterClick('Today')}
            >
              Today
            </button>
          </div>

          <div className="categories-section">
            <h2>Categories</h2>
            <div className="category-container">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="event-card-section">
<div className="head-collapse-link">

  <h2>
    {selectedCategory === 'All'
      ? 'Upcoming Events'
      : `Events in ${selectedCategory}`}
  </h2>
  {filteredEvents.length > 0 && (
    <div className="view-all-link" onClick={handleToggleUpcomingExpand}>
      {isUpcomingExpanded ? 'Collapse' : 'View All'}
    </div>
  )}
  </div>
  <div className={`card-container-box ${isUpcomingExpanded ? 'expanded' : ''}`}>
    {filteredEvents.slice(0, isUpcomingExpanded ? filteredEvents.length : eventsToShow * 4).map((event, index) => (
      <EventCard key={event._id} event={event} onClick={() => handleEventClick(event._id)} />
    ))}
  </div>
</div>

<div className="event-card-section">
<div className="head-collapse-link">
  <h2>Recommended Events</h2>
  {recommendedEvents.length > 0 && (
    <div className="view-all-link" onClick={handleToggleRecommendedExpand}>
      {isRecommendedExpanded ? 'Collapse' : 'View All'}
    </div>
  )}
  </div>
  <div className={`card-container-box ${isRecommendedExpanded ? 'expanded' : ''}`}>
    {recommendedEvents.slice(0, isRecommendedExpanded ? recommendedEvents.length : eventsToShow * 4).map((event) => (
      <EventCard key={event._id} event={event} onClick={() => handleEventClick(event._id)} />
    ))}
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default Home;
