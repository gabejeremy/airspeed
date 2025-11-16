import React from 'react';
import ReactDOM from 'react-dom/client';
import BookingApp from './components/BookingApp.jsx';

// Bootstrap the React application for flight booking
ReactDOM.createRoot(document.getElementById("booking-root")).render(
  <React.StrictMode>
    <BookingApp />
  </React.StrictMode>
);