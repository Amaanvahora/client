import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import moment from 'moment';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const MyTimeline = () => {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([{ id: 1, title: 'Events' }]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', description: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/events', {
          withCredentials: true,
        });
        const formattedEvents = response.data.map(event => ({
          id: event._id,
          group: 1,
          title: event.title,
          start_time: moment(event.date + ' ' + event.time),
          end_time: moment(event.date + ' ' + event.time).add(1, 'hour'),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddEvent = async () => {
    const { title, date, time, description } = newEvent;
    try {
      await axios.post('http://localhost:3001/events', { title, date, time, description }, { withCredentials: true });
      setEvents([...events, {
        id: events.length + 1,
        group: 1,
        title,
        start_time: moment(date + ' ' + time),
        end_time: moment(date + ' ' + time).add(1, 'hour'),
      }]);
      setNewEvent({ title: '', date: '', time: '', description: '' });
      handleClose();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/events/${id}`, { withCredentials: true });
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3 }}>Add Event</Button>
      <Timeline
        groups={groups}
        items={events}
        defaultTimeStart={moment().add(-12, 'hour')}
        defaultTimeEnd={moment().add(12, 'hour')}
        canMove={false}
        canResize={false}
        itemRenderer={({ item, itemContext, getItemProps, getResizeProps }) => (
          <div
            {...getItemProps({
              style: {
                background: itemContext.selected ? 'rgba(0, 133, 255, 0.7)' : 'rgba(0, 133, 255, 0.5)',
                borderRadius: '4px',
                border: itemContext.resizing ? '1px solid red' : '1px solid rgba(0, 133, 255, 1)',
                color: 'white',
                padding: '4px',
              },
            })}
          >
            {item.title}
            <Button size="small" onClick={() => handleDeleteEvent(item.id)} style={{ color: 'white', marginLeft: '10px' }}>Delete</Button>
          </div>
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddEvent}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyTimeline;
