import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import crewAvailability from '../../client/crew-availability.html';

// Crew Availability Submission Interface
export const crew_availability_portal = UiPage({
  $id: Now.ID['crew-availability-portal'],
  endpoint: 'x_1603915_airspeed_crew_availability.do',
  description: 'Crew availability submission interface with React for AI-optimized scheduling',
  category: 'general',
  html: crewAvailability,
  direct: true
});