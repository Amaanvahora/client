import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Driving Instructor App
        </Typography>
        <Button color="inherit" component={Link} to="/timeline">Timeline</Button>
        <Button color="inherit" component={Link} to="/add-event">Add Event</Button>
        <Button color="inherit" component={Link} to="/events">Event List</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
