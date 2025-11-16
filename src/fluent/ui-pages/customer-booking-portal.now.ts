import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import bookingPortal from '../../client/booking-portal.html';

// SkyServe Customer Portal - Flight Booking Interface
export const skyserve_customer_portal = UiPage({
  $id: Now.ID['skyserve-customer-portal'],
  endpoint: 'x_1603915_airspeed_skyserve_booking.do',
  description: 'SkyServe Customer Portal for flight booking with React interface',
  category: 'general',
  html: bookingPortal,
  direct: true
});