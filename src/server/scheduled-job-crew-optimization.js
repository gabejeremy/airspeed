/**
 * Scheduled Job: Daily Crew Schedule Optimization
 * Schedule: Daily at 6:00 AM
 * 
 * This script processes all Crew Schedule records with status 'availability_submitted'
 * and triggers the optimization flow for each record.
 * 
 * This is an alternative implementation if Flow Designer is not available.
 * It directly calls the CrewScheduleOptimizer and handles the approval routing.
 */

(function() {
    
    try {
        gs.info('[Crew Schedule Daily Job] Starting daily optimization process...');
        
        // Initialize optimizer
        var optimizer = new x_1603915_airspeed.CrewScheduleOptimizer();
        
        // Query all crew schedules awaiting optimization
        var scheduleGR = new GlideRecord('x_1603915_airspeed_crew_schedule');
        scheduleGR.addQuery('state', 'availability_submitted');
        scheduleGR.addQuery('active', 'true');
        scheduleGR.query();
        
        var processedCount = 0;
        var approvedCount = 0;
        var rejectedCount = 0;
        
        while (scheduleGR.next()) {
            var scheduleSysId = scheduleGR.getUniqueValue();
            
            gs.info('[Crew Schedule Daily Job] Processing schedule: ' + scheduleSysId);
            
            // Run optimization and compliance check
            var result = optimizer.optimizeSchedule(scheduleSysId);
            
            // Update the record with optimization results
            scheduleGR.optimized_duty_time = result.optimized_duty_time;
            scheduleGR.compliance_check = result.compliance_status.toLowerCase();
            scheduleGR.violation_details = result.violation_details;
            scheduleGR.state = 'draft_schedule';
            scheduleGR.update();
            
            // Check compliance status and handle accordingly
            if (result.compliance_status === 'Violation') {
                // Mark as rejected due to compliance violation
                scheduleGR.state = 'rejected';
                scheduleGR.work_notes = 'Automatically rejected due to compliance violation: ' + 
                                       result.violation_details;
                scheduleGR.update();
                
                // Send notification to crew member
                sendNotificationToCrewMember(
                    scheduleGR.crew_member.toString(),
                    scheduleGR.flight_number.toString(),
                    'rejected',
                    result.violation_details
                );
                
                rejectedCount++;
                
            } else {
                // Compliance passed - create approval request
                var approvalResult = createApprovalRequest(scheduleGR);
                
                if (approvalResult.success) {
                    gs.info('[Crew Schedule Daily Job] Approval request created for: ' + scheduleSysId);
                    approvedCount++;
                } else {
                    gs.warn('[Crew Schedule Daily Job] Failed to create approval for: ' + scheduleSysId);
                }
            }
            
            processedCount++;
        }
        
        gs.info('[Crew Schedule Daily Job] Completed. Processed: ' + processedCount + 
               ', Approved for routing: ' + approvedCount + 
               ', Rejected: ' + rejectedCount);
        
    } catch (error) {
        gs.error('[Crew Schedule Daily Job] Error: ' + error);
    }
    
})();

/**
 * Create approval request for crew schedule
 */
function createApprovalRequest(scheduleGR) {
    try {
        // Get the Reservations Manager group
        var groupGR = new GlideRecord('sys_user_group');
        groupGR.addQuery('name', 'Reservations Manager');
        groupGR.query();
        
        if (!groupGR.next()) {
            gs.warn('[Crew Schedule] Reservations Manager group not found');
            return { success: false, message: 'Approval group not found' };
        }
        
        var groupSysId = groupGR.getUniqueValue();
        
        // Create approval record
        var approvalGR = new GlideRecord('sysapproval_approver');
        approvalGR.initialize();
        approvalGR.source_table = 'x_1603915_airspeed_crew_schedule';
        approvalGR.sysapproval = scheduleGR.getUniqueValue();
        approvalGR.approver = groupSysId;
        approvalGR.state = 'requested';
        approvalGR.comments = 'Crew schedule optimization completed. Please review and approve.';
        var approvalSysId = approvalGR.insert();
        
        // Update the crew schedule with approval reference
        scheduleGR.manager_approval = approvalSysId;
        scheduleGR.work_notes = 'Schedule optimization completed. Awaiting manager approval.\n' +
                               'Optimized Duty Time: ' + scheduleGR.optimized_duty_time + ' hours\n' +
                               'Compliance Status: ' + scheduleGR.compliance_check;
        scheduleGR.update();
        
        return { success: true, approval_sys_id: approvalSysId };
        
    } catch (error) {
        gs.error('[Crew Schedule] Error creating approval: ' + error);
        return { success: false, message: error.toString() };
    }
}

/**
 * Send notification to crew member
 */
function sendNotificationToCrewMember(crewMemberSysId, flightNumber, status, details) {
    try {
        var subject = '';
        var body = '';
        
        if (status === 'rejected') {
            subject = 'Crew Schedule Rejected - Compliance Violation';
            body = 'Your crew schedule for flight ' + flightNumber + 
                   ' has been rejected due to compliance violations.\n\n' +
                   'Details: ' + details + '\n\n' +
                   'Please review and resubmit your availability.';
        } else if (status === 'approved') {
            subject = 'Crew Schedule Approved';
            body = 'Your crew schedule for flight ' + flightNumber + 
                   ' has been approved.\n\n' +
                   details + '\n\n' +
                   'Thank you for your submission.';
        }
        
        // Create event for notification
        gs.eventQueue('x_1603915_airspeed.crew_schedule_notification', 
                     null, 
                     crewMemberSysId, 
                     subject + '|' + body);
        
    } catch (error) {
        gs.error('[Crew Schedule] Error sending notification: ' + error);
    }
}

