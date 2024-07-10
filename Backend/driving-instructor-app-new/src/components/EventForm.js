import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';

const EventForm = ({ fetchEvents, editingEvent, setEditingEvent }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDate(editingEvent.date);
      setTime(editingEvent.time);
      setDescription(editingEvent.description);
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3001/events', {
        withCredentials: true,
      });
      const existingEvents = response.data;
      const newEventStart = new Date(date + ' ' + time).getTime();
      const newEventEnd = newEventStart + 60 * 60 * 1000; // 1 hour duration

      const hasConflict = existingEvents.some(event => {
        const eventStart = new Date(event.date + ' ' + event.time).getTime();
        const eventEnd = eventStart + 60 * 60 * 1000;
        return (newEventStart < eventEnd && newEventEnd > eventStart);
      });

      if (hasConflict) {
        setError('Time slot is already booked. Please choose a different time.');
        return;
      }

      if (editingEvent) {
        await axios.put(`http://localhost:3001/events/${editingEvent._id}`, {
          title,
          date,
          time,
          description
        }, { withCredentials: true });
        setEditingEvent(null);
      } else {
        await axios.post('http://localhost:3001/events', {
          title,
          date,
          time,
          description
        }, { withCredentials: true });
      }

      fetchEvents();
      setTitle('');
      setDate('');
      setTime('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{editingEvent ? 'Edit Event' : 'Add Event'}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EventForm;
