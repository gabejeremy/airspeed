import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { setCrewMemberToCurrentUser } from '../../server/crew-schedule-defaults.js'

// Business Rule: Auto-populate crew member and set initial status
export const crew_schedule_defaults = BusinessRule({
    $id: Now.ID['crew-schedule-defaults'],
    name: 'Crew Schedule Defaults',
    table: 'x_1603915_airspeed_crew_schedule',
    when: 'before',
    action: ['insert'],
    script: setCrewMemberToCurrentUser,
    order: 50,
    active: true,
    description: 'Automatically sets crew_member to current user if not already specified'
})