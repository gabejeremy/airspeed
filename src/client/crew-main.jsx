import React from 'react';
import ReactDOM from 'react-dom/client';
import CrewAvailabilityApp from './components/CrewAvailabilityApp.jsx';

// Bootstrap the React application for crew availability
ReactDOM.createRoot(document.getElementById("crew-root")).render(
  <React.StrictMode>
    <CrewAvailabilityApp />
  </React.StrictMode>
);