/**
 * Script Include: CrewScheduleOptimizer
 * Scope: x_1603915_airspeed
 * 
 * Provides crew schedule optimization and compliance checking functionality.
 * This simulates an external GenAI/Optimization service for W2 requirements.
 * 
 * API Class: Can be called from Flow Designer, Business Rules, or REST APIs
 */

var CrewScheduleOptimizer = Class.create();

CrewScheduleOptimizer.prototype = {
    
    /**
     * Initialize the optimizer
     */
    initialize: function() {
        this.SCOPE = 'x_1603915_airspeed';
        this.TABLE_CREW_SCHEDULE = 'x_1603915_airspeed_crew_schedule';
        
        // Compliance rule constants (FAA-style regulations)
        this.MAX_HOURS_30_DAYS = 100;
        this.MAX_HOURS_PER_DAY = 14;
        this.MAX_DUTY_PERIOD_HOURS = 16;
        this.MAX_HOURS_ANNUAL = 800;
        this.MIN_REST_HOURS = 10;
        this.MAX_CONSECUTIVE_DAYS = 6;
    },
    
    /**
     * Main optimization function
     * @param {string} crewScheduleSysId - Sys ID of crew schedule record
     * @returns {Object} Optimization results with compliance status
     */
    optimizeSchedule: function(crewScheduleSysId) {
        try {
            // Get the crew schedule record
            var scheduleGR = new GlideRecord(this.TABLE_CREW_SCHEDULE);
            if (!scheduleGR.get(crewScheduleSysId)) {
                return this._createErrorResult('Crew schedule record not found');
            }
            
            var crewMember = scheduleGR.getValue('crew_member');
            var startDate = new GlideDateTime(scheduleGR.getValue('start_date'));
            var endDate = new GlideDateTime(scheduleGR.getValue('end_date'));
            var flightNumber = scheduleGR.getValue('flight_number');
            
            // Calculate schedule duration
            var durationDays = this._calculateDurationDays(startDate, endDate);
            
            // Get crew member's work history
            var workHistory = this._getWorkHistory(crewMember);
            
            // Calculate optimized duty time
            var optimizedDutyTime = this._calculateOptimizedDutyTime(
                durationDays,
                workHistory
            );
            
            // Perform compliance checks
            var complianceResult = this._checkCompliance(
                crewMember,
                optimizedDutyTime,
                durationDays,
                workHistory
            );
            
            // Log results
            gs.info('[CrewScheduleOptimizer] Schedule: ' + crewScheduleSysId + 
                   ', Duration: ' + durationDays + ' days' +
                   ', Optimized Time: ' + optimizedDutyTime + ' hours' +
                   ', Compliance: ' + complianceResult.status);
            
            return {
                optimized_duty_time: optimizedDutyTime,
                compliance_status: complianceResult.status,
                violation_details: complianceResult.details,
                schedule_sys_id: crewScheduleSysId,
                crew_member: crewMember,
                duration_days: durationDays
            };
            
        } catch (error) {
            gs.error('[CrewScheduleOptimizer] Error: ' + error);
            return this._createErrorResult('Optimization error: ' + error);
        }
    },
    
    /**
     * Calculate optimized duty time based on schedule and history
     * @private
     */
    _calculateOptimizedDutyTime: function(durationDays, workHistory) {
        // Base calculation: 8 hours per day
        var baseHours = durationDays * 8;
        
        // AI-style optimization adjustments
        var optimizedHours = baseHours;
        
        // Factor 1: Recent workload adjustment
        if (workHistory.hoursLast30Days > 80) {
            // Heavy workload, reduce by 15%
            optimizedHours = Math.floor(optimizedHours * 0.85);
        } else if (workHistory.hoursLast30Days < 40) {
            // Light workload, can increase by 10%
            optimizedHours = Math.floor(optimizedHours * 1.10);
        }
        
        // Factor 2: Consecutive days worked adjustment
        if (workHistory.consecutiveDays > 5) {
            // Fatigue factor, reduce by 30%
            optimizedHours = Math.floor(optimizedHours * 0.70);
        }
        
        // Factor 3: Ensure minimum efficiency
        if (optimizedHours < 4 && durationDays >= 1) {
            optimizedHours = 4; // Minimum 4 hours for any duty day
        }
        
        // Factor 4: Cap at daily maximum
        var maxForDuration = durationDays * this.MAX_HOURS_PER_DAY;
        if (optimizedHours > maxForDuration) {
            optimizedHours = maxForDuration;
        }
        
        return optimizedHours;
    },
    
    /**
     * Check compliance with all regulations
     * @private
     */
    _checkCompliance: function(crewMember, optimizedDutyTime, durationDays, workHistory) {
        var violations = [];
        
        // Rule 1: Maximum hours in 30-day period
        var projectedTotal30Days = workHistory.hoursLast30Days + optimizedDutyTime;
        if (projectedTotal30Days > this.MAX_HOURS_30_DAYS) {
            violations.push('Exceeds ' + this.MAX_HOURS_30_DAYS + ' hour limit in 30 days ' +
                          '(projected: ' + projectedTotal30Days + ' hours)');
        }
        
        // Rule 2: Maximum hours per day
        var avgHoursPerDay = optimizedDutyTime / Math.max(durationDays, 1);
        if (avgHoursPerDay > this.MAX_HOURS_PER_DAY) {
            violations.push('Average duty time exceeds ' + this.MAX_HOURS_PER_DAY + 
                          ' hours per day (' + avgHoursPerDay.toFixed(1) + ' hours)');
        }
        
        // Rule 3: Rest requirements after consecutive days
        if (workHistory.consecutiveDays >= this.MAX_CONSECUTIVE_DAYS && durationDays < 1) {
            violations.push('Insufficient rest period - minimum ' + this.MIN_REST_HOURS + 
                          ' consecutive hours required after ' + this.MAX_CONSECUTIVE_DAYS + 
                          ' days of duty');
        }
        
        // Rule 4: Maximum duty period
        if (optimizedDutyTime > this.MAX_DUTY_PERIOD_HOURS * durationDays) {
            violations.push('Exceeds maximum ' + this.MAX_DUTY_PERIOD_HOURS + 
                          ' hour duty period per day');
        }
        
        // Rule 5: Annual flight time limit
        var projectedAnnualTotal = workHistory.hoursLastYear + optimizedDutyTime;
        if (projectedAnnualTotal > this.MAX_HOURS_ANNUAL) {
            violations.push('Exceeds annual limit of ' + this.MAX_HOURS_ANNUAL + 
                          ' hours (projected: ' + projectedAnnualTotal + ' hours)');
        }
        
        // Return compliance result
        if (violations.length > 0) {
            return {
                status: 'Violation',
                details: violations.join('; ')
            };
        } else {
            return {
                status: 'Pass',
                details: 'All compliance checks passed successfully'
            };
        }
    },
    
    /**
     * Get crew member's work history
     * @private
     */
    _getWorkHistory: function(crewMember) {
        var history = {
            hoursLast30Days: 0,
            hoursLastYear: 0,
            consecutiveDays: 0,
            lastScheduleDate: null
        };
        
        // Query last 30 days
        var gr30Days = new GlideRecord(this.TABLE_CREW_SCHEDULE);
        gr30Days.addQuery('crew_member', crewMember);
        gr30Days.addQuery('state', 'IN', 'approved_schedule,draft_schedule');
        gr30Days.addQuery('start_date', '>=', this._getDateDaysAgo(30));
        gr30Days.query();
        
        while (gr30Days.next()) {
            var hours = parseInt(gr30Days.getValue('optimized_duty_time')) || 0;
            history.hoursLast30Days += hours;
            history.consecutiveDays++;
        }
        
        // Query last year
        var grYear = new GlideRecord(this.TABLE_CREW_SCHEDULE);
        grYear.addQuery('crew_member', crewMember);
        grYear.addQuery('state', 'approved_schedule');
        grYear.addQuery('start_date', '>=', this._getDateDaysAgo(365));
        grYear.query();
        
        while (grYear.next()) {
            var hoursYear = parseInt(grYear.getValue('optimized_duty_time')) || 0;
            history.hoursLastYear += hoursYear;
        }
        
        return history;
    },
    
    /**
     * Calculate duration in days between two dates
     * @private
     */
    _calculateDurationDays: function(startDate, endDate) {
        var durationMs = endDate.getNumericValue() - startDate.getNumericValue();
        var durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
        return Math.max(durationDays, 1); // Minimum 1 day
    },
    
    /**
     * Get date N days ago
     * @private
     */
    _getDateDaysAgo: function(days) {
        var date = new GlideDateTime();
        date.addDaysLocalTime(-days);
        return date.getDisplayValue();
    },
    
    /**
     * Create error result object
     * @private
     */
    _createErrorResult: function(errorMessage) {
        return {
            optimized_duty_time: 0,
            compliance_status: 'Violation',
            violation_details: errorMessage,
            error: true
        };
    },
    
    /**
     * Batch process multiple schedules
     * @param {Array} scheduleIds - Array of crew schedule sys_ids
     * @returns {Array} Array of optimization results
     */
    batchOptimize: function(scheduleIds) {
        var results = [];
        for (var i = 0; i < scheduleIds.length; i++) {
            var result = this.optimizeSchedule(scheduleIds[i]);
            results.push(result);
        }
        return results;
    },
    
    type: 'CrewScheduleOptimizer'
};

