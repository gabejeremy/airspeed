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
        status: ChoiceColumn({
            label: 'Status',
            choices: {
                availability_submitted: { label: 'Availability Submitted', sequence: 0 },
                draft_schedule: { label: 'Draft Schedule', sequence: 1 },
                approved_schedule: { label: 'Approved Schedule', sequence: 2 },
                conflict: { label: 'Conflict', sequence: 3 },
                rejected: { label: 'Rejected', sequence: 4 },
                closed: { label: 'Closed', sequence: 5 }
            }
        })
    }
})