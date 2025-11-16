import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, ChoiceColumn, IntegerColumn } from '@servicenow/sdk/core'

// Crew Schedule table - tracks crew availability, AI-optimized assignments, and compliance status
export const x_1603915_airspeed_crew_schedule = Table({
    name: 'x_1603915_airspeed_crew_schedule',
    label: 'Crew Schedule',
    extends: 'task',
    accessible_from: 'public',
    allow_web_service_access: true,
    actions: ['create', 'read', 'update', 'delete'],
    schema: {
        crew_member: ReferenceColumn({
            label: 'Crew Member',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        flight_number: StringColumn({
            label: 'Flight Number',
            mandatory: true,
            maxLength: 20
        }),
        optimized_duty_time: IntegerColumn({
            label: 'Optimized Duty Time (minutes)',
            maxLength: 10
        }),
        compliance_check: ChoiceColumn({
            label: 'Compliance Check',
            choices: {
                pass: { label: 'Pass', sequence: 0 },
                warning: { label: 'Warning', sequence: 1 },
                violation: { label: 'Violation', sequence: 2 }
            }
        }),
        violation_details: StringColumn({
            label: 'Violation Details',
            maxLength: 4000
        }),
        manager_approval: ReferenceColumn({
            label: 'Manager Approval',
            referenceTable: 'sysapproval_approver'
        }),
        start_date: StringColumn({
            label: 'Schedule Start Date',
            maxLength: 40
        }),
        end_date: StringColumn({
            label: 'Schedule End Date',
            maxLength: 40
        }),
        availability_notes: StringColumn({
            label: 'Availability Notes',
            maxLength: 4000
        }),
        // Note: 'state' field is inherited from task table and configured with custom choices
        // State values: availability_submitted, draft_schedule, approved_schedule, rejected, closed
    }
})