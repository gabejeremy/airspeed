export class CrewScheduleService {
  constructor() {
    this.tableName = "x_1603915_airspeed_crew_schedule";
  }

  // Create a new crew schedule/availability submission
  async createSchedule(scheduleData) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create schedule');
      }

      const result = await response.json();
      return { success: true, data: result.result };
    } catch (error) {
      console.error('Error creating schedule:', error);
      return { success: false, error: error.message };
    }
  }

  // Get schedules for a specific crew member
  async getUserSchedules(userId) {
    try {
      const response = await fetch(`/api/now/table/${this.tableName}?sysparm_query=crew_member=${userId}&sysparm_display_value=all&sysparm_limit=10&sysparm_order_by=sys_created_on`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching user schedules:', error);
      return [];
    }
  }

  // Update a schedule
  async updateSchedule(sysId, updateData) {
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
        throw new Error('Failed to update schedule');
      }

      const result = await response.json();
      return { success: true, data: result.result };
    } catch (error) {
      console.error('Error updating schedule:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all schedules (for managers/admin view)
  async getAllSchedules(filters = {}) {
    try {
      const searchParams = new URLSearchParams(filters);
      searchParams.set('sysparm_display_value', 'all');
      searchParams.set('sysparm_limit', '50');
      
      const response = await fetch(`/api/now/table/${this.tableName}?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-UserToken": window.g_ck
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return [];
    }
  }
}