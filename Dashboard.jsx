import React from 'react';
import Sidebar from './Sidebar';
import { Typography } from '@mui/material';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Typography variant="h3" className="dashboard-title">
          Welcome to Billedo Dental Clinic
        </Typography>
        <Typography variant="body1" className="dashboard-description">
          Manage your patients, appointments, and clinic operations efficiently.
        </Typography>
      </div>
    </div>
  );
};

export default Dashboard;