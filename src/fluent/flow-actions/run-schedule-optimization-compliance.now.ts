/**
 * Flow Action: Run Schedule Optimization and Compliance Check
 * Scope: x_1603915_airspeed
 * 
 * This scripted action simulates an external GenAI/Optimization service
 * that checks crew schedule compliance with regulations and optimizes duty times.
 * 
 * Inputs:
 * - crew_schedule_sys_id: sys_id of the Crew Schedule record
 * - crew_member: Reference to crew member user
 * - flight_number: Flight identifier
 * - start_date: Schedule start date
 * - end_date: Schedule end date
 * 
 * Outputs:
 * - optimized_duty_time: Calculated optimal duty time (Duration in hours)
 * - compliance_status: 'Pass' or 'Violation'
 * - violation_details: Description of any violations found
 */

import { Action } from '@servicenow/sdk/core';

const action = Action.create({
  name: 'run_schedule_optimization_compliance',
  label: 'Run Schedule Optimization and Compliance Check',
  description: 'Simulates GenAI service to optimize crew schedules and check compliance with regulations',
  
  inputs: {
    crew_schedule_sys_id: {
      type: 'string',
      label: 'Crew Schedule Sys ID',
      mandatory: true
    },
    crew_member: {
      type: 'reference',
      reference: 'sys_user',
      label: 'Crew Member',
      mandatory: true
    },
    flight_number: {
      type: 'string',
      label: 'Flight Number',
      mandatory: true
    },
    start_date: {
      type: 'glide_date',
      label: 'Schedule Start Date',
      mandatory: true
    },
    end_date: {
      type: 'glide_date',
      label: 'Schedule End Date',
      mandatory: true
    }
  },
  
  outputs: {
    optimized_duty_time: {
      type: 'integer',
      label: 'Optimized Duty Time (hours)'
    },
    compliance_status: {
      type: 'string',
      label: 'Compliance Status'
    },
    violation_details: {
      type: 'string',
      label: 'Violation Details'
    }
  },
  
  script: (inputs) => {
    /**
     * SIMULATION OF GENAI OPTIMIZATION SERVICE (W2)
     * 
     * In production, this would call an external API or AI service.
     * For demonstration, we implement business logic that:
     * 1. Calculates optimal duty time based on schedule duration
     * 2. Checks against FAA/regulatory compliance rules
     * 3. Returns optimization results and compliance status
     */
    
    // Initialize outputs
    let optimizedDutyTime = 0;
    let complianceStatus = 'Pass';
    let violationDetails = '';
    
    try {
      // Parse dates
      const startDate = new GlideDateTime(inputs.start_date);
      const endDate = new GlideDateTime(inputs.end_date);
      
      // Calculate duration in days
      const durationMs = endDate.getNumericValue() - startDate.getNumericValue();
      const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
      
      // Get crew member's recent schedule history for compliance checking
      const recentSchedules = new GlideRecord('x_1603915_airspeed_crew_schedule');
      recentSchedules.addQuery('crew_member', inputs.crew_member);
      recentSchedules.addQuery('state', 'IN', 'approved_schedule,draft_schedule');
      recentSchedules.addQuery('start_date', '>=', getDateDaysAgo(30));
      recentSchedules.query();
      
      let totalDutyHoursLast30Days = 0;
      let consecutiveDaysWorked = 0;
      
      while (recentSchedules.next()) {
        totalDutyHoursLast30Days += parseInt(recentSchedules.getValue('optimized_duty_time') || '0');
        consecutiveDaysWorked++;
      }
      
      // OPTIMIZATION LOGIC
      // Base calculation: 8 hours per day of availability
      optimizedDutyTime = durationDays * 8;
      
      // Adjust based on workload (simulation of AI optimization)
      if (totalDutyHoursLast30Days > 200) {
        // Crew member has been working heavily, reduce duty time
        optimizedDutyTime = Math.floor(optimizedDutyTime * 0.85);
      }
      
      // Ensure minimum rest periods
      if (durationDays < 2 && consecutiveDaysWorked > 5) {
        optimizedDutyTime = Math.floor(optimizedDutyTime * 0.7);
      }
      
      // COMPLIANCE CHECKING (FAA-style regulations simulation)
      const violations = [];
      
      // Rule 1: Maximum 100 hours in any 30-day period
      const projectedTotal = totalDutyHoursLast30Days + optimizedDutyTime;
      if (projectedTotal > 100) {
        violations.push(`Exceeds maximum 100 flight hours in 30 days (Projected: ${projectedTotal} hours)`);
      }
      
      // Rule 2: Maximum 14 hours duty time per day
      const avgHoursPerDay = optimizedDutyTime / Math.max(durationDays, 1);
      if (avgHoursPerDay > 14) {
        violations.push(`Average duty time exceeds 14 hours per day (${avgHoursPerDay.toFixed(1)} hours)`);
      }
      
      // Rule 3: Minimum 10 consecutive hours of rest required after 6 consecutive days
      if (consecutiveDaysWorked >= 6 && durationDays < 1) {
        violations.push('Insufficient rest period - minimum 10 consecutive hours required after 6 days of duty');
      }
      
      // Rule 4: Maximum duty period of 16 hours
      if (optimizedDutyTime > 16 * durationDays) {
        violations.push('Exceeds maximum 16-hour duty period per day');
      }
      
      // Rule 5: Flight time limitations (800 hours per year simulation)
      const yearSchedules = new GlideRecord('x_1603915_airspeed_crew_schedule');
      yearSchedules.addQuery('crew_member', inputs.crew_member);
      yearSchedules.addQuery('state', 'approved_schedule');
      yearSchedules.addQuery('start_date', '>=', getDateDaysAgo(365));
      yearSchedules.query();
      
      let totalYearHours = 0;
      while (yearSchedules.next()) {
        totalYearHours += parseInt(yearSchedules.getValue('optimized_duty_time') || '0');
      }
      
      if (totalYearHours + optimizedDutyTime > 800) {
        violations.push(`Exceeds annual flight time limit of 800 hours (Projected: ${totalYearHours + optimizedDutyTime} hours)`);
      }
      
      // Set compliance status
      if (violations.length > 0) {
        complianceStatus = 'Violation';
        violationDetails = violations.join('; ');
      } else {
        complianceStatus = 'Pass';
        violationDetails = 'All compliance checks passed successfully.';
      }
      
      // Log the optimization results for auditing
      gs.info(`[Crew Schedule Optimization] Schedule ${inputs.crew_schedule_sys_id}: ` +
              `Status=${complianceStatus}, Duration=${durationDays}d, ` +
              `OptimizedTime=${optimizedDutyTime}h, Violations=${violations.length}`);
      
    } catch (error) {
      // Handle errors gracefully
      gs.error(`[Crew Schedule Optimization] Error processing schedule ${inputs.crew_schedule_sys_id}: ${error}`);
      complianceStatus = 'Violation';
      violationDetails = 'Error during optimization process: ' + error.toString();
      optimizedDutyTime = 0;
    }
    
    return {
      optimized_duty_time: optimizedDutyTime,
      compliance_status: complianceStatus,
      violation_details: violationDetails
    };
  }
});

/**
 * Helper function to get date N days ago
 */
function getDateDaysAgo(days: number): string {
  const date = new GlideDateTime();
  date.addDaysLocalTime(-days);
  return date.getDisplayValue();
}

export default action;

