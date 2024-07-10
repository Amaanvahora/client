import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const EventForm = ({ fetchEvents, editingEvent, setEditingEvent }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

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
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{editingEvent ? 'Edit Event' : 'Add Event'}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {editingEvent ? 'Update Event' : 'Add Event'}
        </Button>
      </Box>
    </Container>
  );
};

export default EventForm;
