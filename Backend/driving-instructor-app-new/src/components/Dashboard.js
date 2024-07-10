import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import MyTimeline from './Timeline';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, IconButton, TextField, Select, MenuItem, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../App.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
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

  const filteredEvents = events.filter(event => event.title.includes(filter));

  const sortedEvents = filteredEvents.sort((a, b) => {
    if (sortCriteria === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortCriteria === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Dashboard</Typography>
      <Typography variant="h5" gutterBottom>Upcoming Events</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Filter by Title"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Sort By</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <EventForm fetchEvents={fetchEvents} editingEvent={editingEvent} setEditingEvent={setEditingEvent} />
      <Box sx={{ mt: 3 }}>
        <List>
          {sortedEvents.map(event => (
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
      </Box>
      <Box sx={{ mt: 5 }}>
        <MyTimeline />
      </Box>
    </Container>
  );
};

export default Dashboard;
