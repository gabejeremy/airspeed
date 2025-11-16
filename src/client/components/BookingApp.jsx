import React, { useState } from 'react';
import { FlightBookingService } from '../services/FlightBookingService.js';
import './BookingApp.css';

export default function BookingApp() {
  const [formData, setFormData] = useState({
    flight_number: '',
    origin: '',
    destination: '',
    departure_datetime: '',
    preferred_class: '',
    meal_preference: '',
    seat_preference: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const service = new FlightBookingService();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      // Get current user info
      const currentUser = await getCurrentUser();
      
      // Prepare booking data
      const bookingData = {
        ...formData,
        requested_by: currentUser.sys_id,
        state: '1', // New state for task
        short_description: `Flight Booking: ${formData.flight_number} from ${formData.origin} to ${formData.destination}`
      };
      
      const result = await service.createBooking(bookingData);
      
      if (result.success) {
        setMessage('Flight booking submitted successfully! You will receive confirmation shortly.');
        setFormData({
          flight_number: '',
          origin: '',
          destination: '',
          departure_datetime: '',
          preferred_class: '',
          meal_preference: '',
          seat_preference: ''
        });
      } else {
        setMessage('Error submitting booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setMessage('Error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await fetch('/api/now/table/sys_user?sysparm_query=user_name=javascript:gs.getUserName()&sysparm_limit=1', {
        headers: {
          'Accept': 'application/json',
          'X-UserToken': window.g_ck
        }
      });
      const data = await response.json();
      return data.result && data.result.length > 0 ? data.result[0] : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  return (
    <div className="booking-app">
      <header className="booking-header">
        <h1>SkyServe Customer Portal</h1>
        <h2>Book Your Flight</h2>
      </header>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="flight_number">Flight Number *</label>
            <input
              type="text"
              id="flight_number"
              name="flight_number"
              value={formData.flight_number}
              onChange={handleInputChange}
              required
              placeholder="e.g., AS123"
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferred_class">Preferred Class</label>
            <select
              id="preferred_class"
              name="preferred_class"
              value={formData.preferred_class}
              onChange={handleInputChange}
            >
              <option value="">Select Class</option>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="origin">Origin</label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              placeholder="Departure city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="Arrival city"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="departure_datetime">Departure Date & Time</label>
            <input
              type="datetime-local"
              id="departure_datetime"
              name="departure_datetime"
              value={formData.departure_datetime}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="seat_preference">Seat Preference</label>
            <input
              type="text"
              id="seat_preference"
              name="seat_preference"
              value={formData.seat_preference}
              onChange={handleInputChange}
              placeholder="Window, Aisle, etc."
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="meal_preference">Meal Preference</label>
          <input
            type="text"
            id="meal_preference"
            name="meal_preference"
            value={formData.meal_preference}
            onChange={handleInputChange}
            placeholder="Vegetarian, Kosher, No preference, etc."
          />
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Book Flight'}
        </button>
      </form>
    </div>
  );
}