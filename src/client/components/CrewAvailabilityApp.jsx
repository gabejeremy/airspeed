import React, { useState, useEffect } from 'react';
import { CrewScheduleService } from '../services/CrewScheduleService.js';
import './CrewAvailabilityApp.css';

export default function CrewAvailabilityApp() {
  const [formData, setFormData] = useState({
    available_start_date: '',
    available_end_date: '',
    flight_number: '',
    notes: ''
  });
  
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [userSchedules, setUserSchedules] = useState([]);
  
  const service = new CrewScheduleService();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserSchedules();
    }
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/now/table/sys_user?sysparm_query=user_name=javascript:gs.getUserName()&sysparm_limit=1&sysparm_display_value=all', {
        headers: {
          'Accept': 'application/json',
          'X-UserToken': window.g_ck
        }
      });
      const data = await response.json();
      if (data.result && data.result.length > 0) {
        const user = data.result[0];
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadUserSchedules = async () => {
    if (!currentUser) return;
    
    const userId = typeof currentUser.sys_id === 'object' ? currentUser.sys_id.value : currentUser.sys_id;
    const schedules = await service.getUserSchedules(userId);
    setUserSchedules(schedules);
  };

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
      if (!currentUser) {
        setMessage('Error: Unable to identify current user.');
        return;
      }

      const userId = typeof currentUser.sys_id === 'object' ? currentUser.sys_id.value : currentUser.sys_id;
      
      // Prepare crew schedule data
      const scheduleData = {
        crew_member: userId,
        flight_number: formData.flight_number,
        status: 'availability_submitted', // Set status as required
        state: '1', // New state for task
        short_description: `Crew Availability: ${formData.flight_number || 'General'} - ${currentUser.name || currentUser.display_value || 'Crew Member'}`,
        work_notes: `Available from ${formData.available_start_date} to ${formData.available_end_date}${formData.notes ? '\nNotes: ' + formData.notes : ''}`
      };
      
      const result = await service.createSchedule(scheduleData);
      
      if (result.success) {
        setMessage('Crew availability submitted successfully! Your schedule has been recorded.');
        setFormData({
          available_start_date: '',
          available_end_date: '',
          flight_number: '',
          notes: ''
        });
        // Reload user schedules
        loadUserSchedules();
      } else {
        setMessage('Error submitting availability. Please try again.');
      }
    } catch (error) {
      console.error('Availability submission error:', error);
      setMessage('Error submitting availability. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'Not specified';
    return new Date(dateTimeStr).toLocaleString();
  };

  const getStatusDisplay = (schedule) => {
    const status = typeof schedule.status === 'object' ? schedule.status.display_value : schedule.status;
    return status || 'Unknown';
  };

  const getFlightNumber = (schedule) => {
    const flightNumber = typeof schedule.flight_number === 'object' ? schedule.flight_number.display_value : schedule.flight_number;
    return flightNumber || 'General Availability';
  };

  return (
    <div className="crew-app">
      <header className="crew-header">
        <h1>AI-Rspeed Flight Orchestration</h1>
        <h2>Submit Crew Availability</h2>
        {currentUser && (
          <p className="user-info">
            Welcome, {typeof currentUser.name === 'object' ? currentUser.name.display_value : currentUser.name || 'Crew Member'}
          </p>
        )}
      </header>

      <div className="content-container">
        <div className="form-section">
          <h3>New Availability Submission</h3>
          <form className="crew-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="available_start_date">Available Start Date & Time *</label>
                <input
                  type="datetime-local"
                  id="available_start_date"
                  name="available_start_date"
                  value={formData.available_start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="available_end_date">Available End Date & Time *</label>
                <input
                  type="datetime-local"
                  id="available_end_date"
                  name="available_end_date"
                  value={formData.available_end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="flight_number">Specific Flight Number (Optional)</label>
              <input
                type="text"
                id="flight_number"
                name="flight_number"
                value={formData.flight_number}
                onChange={handleInputChange}
                placeholder="e.g., AS123 (leave blank for general availability)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any special considerations, preferences, or constraints..."
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
              {isSubmitting ? 'Submitting...' : 'Submit Availability'}
            </button>
          </form>
        </div>

        <div className="schedules-section">
          <h3>Your Recent Submissions</h3>
          {userSchedules.length > 0 ? (
            <div className="schedules-list">
              {userSchedules.slice(0, 5).map((schedule, index) => {
                const sysId = typeof schedule.sys_id === 'object' ? schedule.sys_id.value : schedule.sys_id;
                return (
                  <div key={sysId || index} className="schedule-item">
                    <div className="schedule-header">
                      <span className="flight-number">{getFlightNumber(schedule)}</span>
                      <span className={`status ${getStatusDisplay(schedule).toLowerCase().replace(' ', '-')}`}>
                        {getStatusDisplay(schedule)}
                      </span>
                    </div>
                    <div className="schedule-details">
                      <p>
                        <strong>Submitted:</strong> {formatDateTime(typeof schedule.sys_created_on === 'object' ? schedule.sys_created_on.display_value : schedule.sys_created_on)}
                      </p>
                      {schedule.work_notes && (
                        <p><strong>Notes:</strong> {typeof schedule.work_notes === 'object' ? schedule.work_notes.display_value : schedule.work_notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-schedules">No recent submissions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}