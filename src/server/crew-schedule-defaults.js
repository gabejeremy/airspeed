import { gs } from '@servicenow/glide';

// Auto-populate crew member field with current user on crew schedule creation
export function setCrewMemberToCurrentUser(current, previous) {
    // Only run on insert and if crew_member is not already set
    if (!current.crew_member.nil()) {
        return; // Crew member already set, don't override
    }
    
    // Set crew_member to current logged-in user
    current.crew_member = gs.getUserID();
    
    // Log the action
    gs.info(`Auto-populated crew_member field with current user: ${gs.getUserName()}`);
}