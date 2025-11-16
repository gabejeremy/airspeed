/**
 * Business Rule: Crew Schedule Approval Handler
 * Table: sysapproval_approver
 * When: After Update
 * 
 * Handles approval outcomes for crew schedules (W3 requirement).
 * Updates the crew schedule record based on approval/rejection and sends notifications.
 */

import '@servicenow/sdk/global';
import { BusinessRule } from '@servicenow/sdk/core';

const rule = BusinessRule.create({
  name: 'crew_schedule_approval_handler',
  table: 'sysapproval_approver',
  when: 'after',
  operation: 'update',
  condition: function(current: any, previous: any) {
    // Only run when state changes and source table is crew_schedule
    return (
      current.state.changes() &&
      current.source_table.toString() === 'x_1603915_airspeed_crew_schedule'
    );
  },
  script: function(current: any, previous: any) {
    try {
      const approvalState = current.state.toString();
      const scheduleSysId = current.sysapproval.toString();
      const comments = current.comments.toString();
      
      // Get the crew schedule record
      const scheduleGR = new GlideRecord('x_1603915_airspeed_crew_schedule');
      if (!scheduleGR.get(scheduleSysId)) {
        gs.error('[Crew Schedule Approval] Schedule record not found: ' + scheduleSysId);
        return;
      }
      
      const crewMember = scheduleGR.crew_member.toString();
      const flightNumber = scheduleGR.flight_number.toString();
      const optimizedTime = scheduleGR.optimized_duty_time.toString();
      const complianceStatus = scheduleGR.compliance_check.toString();
      
      // Handle approval outcome
      if (approvalState === 'approved') {
        // Update schedule to approved state
        scheduleGR.state = 'approved_schedule';
        scheduleGR.work_notes = 'Schedule approved by manager. ' +
                               'Optimized duty time: ' + optimizedTime + ' hours.';
        scheduleGR.update();
        
        // Send approval notification
        sendCrewNotification(
          crewMember,
          flightNumber,
          'approved',
          'Optimized Duty Time: ' + optimizedTime + ' hours\n' +
          'Compliance Status: ' + complianceStatus + '\n\n' +
          'Thank you for your submission.'
        );
        
        gs.info('[Crew Schedule Approval] Approved: ' + scheduleSysId);
        
      } else if (approvalState === 'rejected') {
        // Update schedule to rejected state
        scheduleGR.state = 'rejected';
        scheduleGR.work_notes = 'Schedule rejected by manager. Reason: ' + comments;
        scheduleGR.update();
        
        // Send rejection notification
        sendCrewNotification(
          crewMember,
          flightNumber,
          'rejected',
          'Reason: ' + comments + '\n\n' +
          'Please review the feedback and resubmit your availability.'
        );
        
        gs.info('[Crew Schedule Approval] Rejected: ' + scheduleSysId);
      }
      
    } catch (error) {
      gs.error('[Crew Schedule Approval] Error handling approval: ' + error);
    }
  }
});

/**
 * Send notification to crew member
 */
function sendCrewNotification(
  crewMemberSysId: string,
  flightNumber: string,
  status: string,
  details: string
): void {
  try {
    let subject = '';
    let body = '';
    
    if (status === 'approved') {
      subject = 'Crew Schedule Approved';
      body = 'Your crew schedule for flight ' + flightNumber + 
             ' has been approved.\n\n' + details;
    } else if (status === 'rejected') {
      subject = 'Crew Schedule Rejected by Manager';
      body = 'Your crew schedule for flight ' + flightNumber + 
             ' has been rejected by the manager.\n\n' + details;
    }
    
    // Queue notification event
    gs.eventQueue(
      'x_1603915_airspeed.crew_schedule_notification',
      null,
      crewMemberSysId,
      subject + '|' + body
    );
    
  } catch (error) {
    gs.error('[Crew Schedule Notification] Error: ' + error);
  }
}

export default rule;

