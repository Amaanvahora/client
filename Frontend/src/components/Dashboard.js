import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../App.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/events', {
        withCredentials: true,
      });
      setEvents(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Redirect to login if not authenticated
      } else {
        console.error('Error fetching events:', error);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/events/${id}`, {
        withCredentials: true,
      });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Dashboard</Typography>
      <Typography variant="h5" gutterBottom>Upcoming Events</Typography>
      <EventForm fetchEvents={fetchEvents} editingEvent={editingEvent} setEditingEvent={setEditingEvent} />
      <List>
        {events.map(event => (
          <ListItem key={event._id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(event)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(event._id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }>
            <ListItemText primary={`${event.title} - ${event.date} ${event.time}`} secondary={event.description} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Dashboard;
