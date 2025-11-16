/**
 * Flow: Crew Schedule Optimization and Approval Flow
 * Scope: x_1603915_airspeed
 * 
 * This flow processes crew schedule records daily, performs optimization
 * and compliance checks, and routes for approval based on compliance status.
 * 
 * Trigger: Scheduled Daily
 * Target: Crew Schedule records with status 'Availability Submitted'
 */

import { Flow } from '@servicenow/sdk/core';

const flow = Flow.create({
  name: 'crew_schedule_optimization_approval',
  label: 'Crew Schedule Optimization and Approval Flow',
  description: 'Daily processing of crew schedules with GenAI optimization, compliance checking, and approval routing',
  
  trigger: {
    type: 'scheduled',
    schedule: {
      frequency: 'daily',
      time: '06:00:00', // Run at 6 AM daily
      timezone: 'America/Los_Angeles'
    }
  },

  /**
   * Flow Steps:
   * 1. Look up Crew Schedule records with status 'Availability Submitted'
   * 2. For each record, run optimization and compliance check
   * 3. If compliance violation, mark as 'Rejected'
   * 4. If compliance pass, route for manager approval
   * 5. Update record based on approval outcome
   */
  steps: [
    {
      name: 'lookup_crew_schedules',
      type: 'lookup_records',
      table: 'x_1603915_airspeed_crew_schedule',
      query: 'state=availability_submitted^active=true',
      fields: [
        'sys_id',
        'crew_member',
        'flight_number',
        'start_date',
        'end_date',
        'availability_notes',
        'state'
      ]
    },
    
    {
      name: 'process_each_schedule',
      type: 'for_each',
      source: '{{steps.lookup_crew_schedules.records}}',
      
      steps: [
        {
          name: 'run_optimization_check',
          type: 'action',
          action: 'x_1603915_airspeed.run_schedule_optimization_compliance',
          inputs: {
            crew_schedule_sys_id: '{{item.sys_id}}',
            crew_member: '{{item.crew_member}}',
            flight_number: '{{item.flight_number}}',
            start_date: '{{item.start_date}}',
            end_date: '{{item.end_date}}'
          }
        },
        
        {
          name: 'update_with_optimization_results',
          type: 'update_record',
          table: 'x_1603915_airspeed_crew_schedule',
          sys_id: '{{item.sys_id}}',
          fields: {
            optimized_duty_time: '{{steps.run_optimization_check.optimized_duty_time}}',
            compliance_check: '{{steps.run_optimization_check.compliance_status}}',
            violation_details: '{{steps.run_optimization_check.violation_details}}',
            state: 'draft_schedule'
          }
        },
        
        {
          name: 'check_compliance_status',
          type: 'if',
          condition: '{{steps.run_optimization_check.compliance_status}} == "Violation"',
          
          then: [
            {
              name: 'mark_as_rejected',
              type: 'update_record',
              table: 'x_1603915_airspeed_crew_schedule',
              sys_id: '{{item.sys_id}}',
              fields: {
                state: 'rejected',
                work_notes: 'Automatically rejected due to compliance violation: {{steps.run_optimization_check.violation_details}}'
              }
            },
            {
              name: 'notify_crew_violation',
              type: 'send_notification',
              to: '{{item.crew_member}}',
              subject: 'Crew Schedule Rejected - Compliance Violation',
              body: 'Your crew schedule for flight {{item.flight_number}} has been rejected due to compliance violations.\n\nDetails: {{steps.run_optimization_check.violation_details}}\n\nPlease review and resubmit your availability.'
            }
          ],
          
          else: [
            {
              name: 'request_manager_approval',
              type: 'ask_for_approval',
              approval: {
                approvers: {
                  type: 'group',
                  group: 'Reservations Manager'
                },
                approval_field: 'manager_approval',
                journal_field: 'work_notes',
                record: '{{item.sys_id}}',
                table: 'x_1603915_airspeed_crew_schedule'
              }
            },
            
            {
              name: 'check_approval_outcome',
              type: 'if',
              condition: '{{steps.request_manager_approval.outcome}} == "approved"',
              
              then: [
                {
                  name: 'mark_as_approved',
                  type: 'update_record',
                  table: 'x_1603915_airspeed_crew_schedule',
                  sys_id: '{{item.sys_id}}',
                  fields: {
                    state: 'approved_schedule',
                    work_notes: 'Schedule approved by manager. Optimized duty time: {{steps.run_optimization_check.optimized_duty_time}} hours.'
                  }
                },
                {
                  name: 'notify_crew_approved',
                  type: 'send_notification',
                  to: '{{item.crew_member}}',
                  subject: 'Crew Schedule Approved',
                  body: 'Your crew schedule for flight {{item.flight_number}} has been approved.\n\nOptimized Duty Time: {{steps.run_optimization_check.optimized_duty_time}} hours\nCompliance Status: {{steps.run_optimization_check.compliance_status}}\n\nThank you for your submission.'
                }
              ],
              
              else: [
                {
                  name: 'mark_as_rejected_by_manager',
                  type: 'update_record',
                  table: 'x_1603915_airspeed_crew_schedule',
                  sys_id: '{{item.sys_id}}',
                  fields: {
                    state: 'rejected',
                    work_notes: 'Schedule rejected by manager. Reason: {{steps.request_manager_approval.comments}}'
                  }
                },
                {
                  name: 'notify_crew_rejected',
                  type: 'send_notification',
                  to: '{{item.crew_member}}',
                  subject: 'Crew Schedule Rejected by Manager',
                  body: 'Your crew schedule for flight {{item.flight_number}} has been rejected by the manager.\n\nReason: {{steps.request_manager_approval.comments}}\n\nPlease review the feedback and resubmit your availability.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

export default flow;

