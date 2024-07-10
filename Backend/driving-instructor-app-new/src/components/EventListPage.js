import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Container, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EventListPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/events', {
          withCredentials: true,
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/events/${id}`, {
        withCredentials: true,
      });
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Event List</Typography>
      <List>
        {events.map(event => (
          <ListItem key={event._id} secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit">
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

export default EventListPage;
