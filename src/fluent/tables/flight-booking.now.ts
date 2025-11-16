import '@servicenow/sdk/global'
import { Table, StringColumn, ReferenceColumn, DateTimeColumn, ChoiceColumn } from '@servicenow/sdk/core'

// Flight Booking table - tracks customer reservations and personalized experience data
export const x_1603915_airspeed_flight_booking = Table({
    name: 'x_1603915_airspeed_flight_booking',
    label: 'Flight Booking',
    extends: 'task',
    accessible_from: 'public',
    allow_web_service_access: true,
    actions: ['create', 'read', 'update', 'delete'],
    schema: {
        flight_number: StringColumn({
            label: 'Flight Number',
            mandatory: true,
            maxLength: 20
        }),
        requested_by: ReferenceColumn({
            label: 'Requested By',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        origin: StringColumn({
            label: 'Origin',
            maxLength: 100
        }),
        destination: StringColumn({
            label: 'Destination',
            maxLength: 100
        }),
        departure_datetime: DateTimeColumn({
            label: 'Departure Date/Time'
        }),
        preferred_class: ChoiceColumn({
            label: 'Preferred Class',
            choices: {
                economy: { label: 'Economy', sequence: 0 },
                business: { label: 'Business', sequence: 1 },
                first: { label: 'First', sequence: 2 }
            }
        }),
        meal_preference: StringColumn({
            label: 'Meal Preference',
            maxLength: 200
        }),
        genai_recommendation: StringColumn({
            label: 'GenAI Recommendation',
            maxLength: 4000
        })
    }
})