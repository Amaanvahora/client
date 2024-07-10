import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import TimelinePage from './components/TimelinePage';
import AddEventPage from './components/AddEventPage';
import EventListPage from './components/EventListPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/add-event" element={<AddEventPage />} />
        <Route path="/events" element={<EventListPage />} />
        <Route path="/" element={<TimelinePage />} />
      </Routes>
    </Router>
  );
};

export default App;
