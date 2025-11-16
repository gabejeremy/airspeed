export class FlightBookingService {
  constructor() {
    this.tableName = "x_1603915_airspeed_flight_booking";
  }

  // Create a new flight booking
  async createBooking(bookingData) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create booking');
      }

      const result = await response.json();
      return { success: true, data: result.result };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Get bookings for current user
  async getUserBookings(userId) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}?sysparm_query=requested_by=${userId}&sysparm_display_value=all`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }

  // Update a booking
  async updateBooking(sysId, updateData) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}/${sysId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      const result = await response.json();
      return { success: true, data: result.result };
    } catch (error) {
      console.error('Error updating booking:', error);
      return { success: false, error: error.message };
    }
  }
}