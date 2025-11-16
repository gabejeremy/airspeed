# Flow Designer Implementation Guide
## Crew Schedule Optimization and Approval Flow (W2, W3)

This guide provides step-by-step instructions for implementing the Core Crew Scheduling Flow in ServiceNow Flow Designer.

---

## Overview

**Flow Name:** Crew Schedule Optimization and Approval Flow  
**Purpose:** Daily processing of crew schedules with GenAI optimization, compliance checking, and approval routing  
**Trigger:** Scheduled Daily at 6:00 AM  
**Scope:** x_1603915_airspeed

---

## Prerequisites

Before implementing the flow, ensure these components are in place:

### 1. Tables
- ✅ **Crew Schedule** (`x_1603915_airspeed_crew_schedule`)
  - Extends: task table
  - Key fields: crew_member, flight_number, start_date, end_date, optimized_duty_time, compliance_check, violation_details, manager_approval

### 2. Script Includes
- ✅ **CrewScheduleOptimizer** (`x_1603915_airspeed.CrewScheduleOptimizer`)
  - Location: `src/server/CrewScheduleOptimizer.js`
  - Provides optimization and compliance checking logic

### 3. User Groups
- **Reservations Manager** group must exist for approval routing
  - Navigate to: User Administration > Groups
  - Create if not exists: Name = "Reservations Manager"
  - Add appropriate managers to this group

---

## Implementation Options

You can implement this workflow using one of two approaches:

### Option A: Flow Designer (Recommended)
Use ServiceNow's visual Flow Designer interface for easier maintenance and visibility.

### Option B: Scheduled Script
Use a scheduled job script for direct implementation without Flow Designer.

---

## Option A: Flow Designer Implementation

### Step 1: Create the Flow

1. Navigate to **Flow Designer** (Process Automation > Flow Designer)
2. Click **New** > **Flow**
3. Configure flow properties:
   - **Name:** Crew Schedule Optimization and Approval Flow
   - **Application:** AI-Rspeed: Flight Orchestration (x_1603915_airspeed)
   - **Description:** Daily processing of crew schedules with GenAI optimization, compliance checking, and approval routing

### Step 2: Configure the Trigger

1. Click **Add a trigger**
2. Select **Schedule** > **Daily**
3. Configure schedule:
   - **Time:** 06:00:00 (6:00 AM)
   - **Timezone:** Select appropriate timezone
   - **Run as:** System

### Step 3: Add Record Lookup

1. Click **Add an Action, Flow Logic, or Subflow**
2. Select **Action** > **ServiceNow Core** > **Look Up Records**
3. Configure:
   - **Label:** Look Up Crew Schedules
   - **Table:** Crew Schedule [x_1603915_airspeed_crew_schedule]
   - **Conditions:**
     - `State` is `availability_submitted`
     - `Active` is `true`
   - **Fields to Retrieve:** sys_id, crew_member, flight_number, start_date, end_date, state

### Step 4: Create Scripted Action for Optimization

1. In Flow Designer, click **New** > **Action**
2. Configure action properties:
   - **Action name:** Run Schedule Optimization and Compliance Check
   - **Application:** AI-Rspeed: Flight Orchestration
   - **Description:** Simulates GenAI service to optimize crew schedules and check compliance

3. **Define Inputs:**
   - `crew_schedule_sys_id` (String, Mandatory)
   - `crew_member` (Reference: sys_user, Mandatory)
   - `flight_number` (String, Mandatory)
   - `start_date` (Date, Mandatory)
   - `end_date` (Date, Mandatory)

4. **Define Outputs:**
   - `optimized_duty_time` (Integer)
   - `compliance_status` (String)
   - `violation_details` (String)

5. **Add Script Step:**
   - Click **Create Script Step**
   - Paste the script from `src/server/flow-action-script-optimization.js`

6. **Publish the Action**

### Step 5: Add For Each Loop

Back in the main flow:

1. Add **Flow Logic** > **For Each**
2. Configure:
   - **Label:** Process Each Schedule
   - **Items:** Drag the data pill from "Look Up Crew Schedules" > Records

### Step 6: Add Optimization Action (Inside Loop)

1. Inside the For Each loop, add **Action**
2. Select your custom action: **Run Schedule Optimization and Compliance Check**
3. Map inputs:
   - `crew_schedule_sys_id` → Current item > Sys ID
   - `crew_member` → Current item > Crew Member
   - `flight_number` → Current item > Flight Number
   - `start_date` → Current item > Start Date
   - `end_date` → Current item > End Date

### Step 7: Update Record with Results

1. Add **Action** > **ServiceNow Core** > **Update Record**
2. Configure:
   - **Label:** Update with Optimization Results
   - **Table:** Crew Schedule
   - **Record:** Current item > Sys ID
   - **Fields to Update:**
     - `optimized_duty_time` → Run Schedule Optimization > Optimized Duty Time
     - `compliance_check` → Run Schedule Optimization > Compliance Status
     - `violation_details` → Run Schedule Optimization > Violation Details
     - `state` → "draft_schedule"

### Step 8: Add Compliance Check Decision

1. Add **Flow Logic** > **If**
2. Configure condition:
   - **Label:** Check Compliance Status
   - **Condition:** Run Schedule Optimization > Compliance Status | is | "Violation"

### Step 9: Configure "Then" Branch (Violation Path)

Inside the "Then" branch:

1. **Add Update Record:**
   - **Table:** Crew Schedule
   - **Record:** Current item > Sys ID
   - **Fields:**
     - `state` → "rejected"
     - `work_notes` → "Automatically rejected due to compliance violation: [violation details]"

2. **Add Send Notification:**
   - **Who to notify:** Current item > Crew Member
   - **Subject:** "Crew Schedule Rejected - Compliance Violation"
   - **Body:** 
     ```
     Your crew schedule for flight [flight_number] has been rejected due to compliance violations.
     
     Details: [violation_details]
     
     Please review and resubmit your availability.
     ```

### Step 10: Configure "Else" Branch (Pass Path)

Inside the "Else" branch:

1. **Add Ask For Approval:**
   - **Label:** Request Manager Approval
   - **Record:** Current item > Sys ID
   - **Table:** Crew Schedule
   - **Rules:**
     - **Type:** Group
     - **Group:** Reservations Manager
   - **Approval Field:** manager_approval
   - **Journal Field:** work_notes

2. **Add Nested If (Check Approval Outcome):**
   - **Condition:** Request Manager Approval > Outcome | is | "approved"

3. **In Approval "Then" (Approved):**
   - Update Record:
     - `state` → "approved_schedule"
     - `work_notes` → "Schedule approved by manager"
   - Send Notification:
     - **To:** Current item > Crew Member
     - **Subject:** "Crew Schedule Approved"
     - **Body:** Success message

4. **In Approval "Else" (Rejected):**
   - Update Record:
     - `state` → "rejected"
     - `work_notes` → "Schedule rejected by manager"
   - Send Notification:
     - **To:** Current item > Crew Member
     - **Subject:** "Crew Schedule Rejected by Manager"
     - **Body:** Rejection message with comments

### Step 11: Test and Activate

1. **Test the Flow:**
   - Create test Crew Schedule records with state "availability_submitted"
   - Click **Test** in Flow Designer
   - Select **Run Once**
   - Review execution log

2. **Activate the Flow:**
   - Click **Activate**
   - Confirm activation

---

## Option B: Scheduled Script Implementation

If you prefer a direct scheduled job approach:

### Step 1: Create Scheduled Job

1. Navigate to **System Scheduler** > **Scheduled Jobs**
2. Click **New**
3. Configure:
   - **Name:** Daily Crew Schedule Optimization
   - **Application:** AI-Rspeed: Flight Orchestration
   - **Condition:** true
   - **Run:** Daily
   - **Time:** 06:00:00
   - **Timezone:** Select appropriate
4. **Script:** Paste content from `src/server/scheduled-job-crew-optimization.js`
5. Save and activate

### Step 2: Implement Business Rule for Approvals

The business rule is already created:
- File: `src/fluent/business-rules/crew-schedule-approval-handler.now.ts`
- This handles approval state changes automatically

---

## Compliance Rules Implemented (W2)

The optimization engine checks these FAA-style regulations:

| Rule | Description | Limit |
|------|-------------|-------|
| 1 | Maximum flight hours in 30-day period | 100 hours |
| 2 | Maximum duty hours per day | 14 hours |
| 3 | Minimum rest after consecutive days | 10 hours after 6 days |
| 4 | Maximum duty period per day | 16 hours |
| 5 | Annual flight time limit | 800 hours |

### Violation Handling

- **Pass:** Schedule proceeds to manager approval
- **Violation:** Schedule automatically rejected with details
- All violations are logged in `violation_details` field

---

## Approval Workflow (W3)

### Approval Routing
1. Compliant schedules route to **Reservations Manager** group
2. Any manager in the group can approve/reject
3. Approval tracked in `manager_approval` field

### Approval Outcomes
- **Approved:** State → "approved_schedule", crew notified
- **Rejected:** State → "rejected", crew notified with reason

### Notifications
- Email/system notifications sent for all outcomes
- Includes relevant details (flight number, hours, reasons)

---

## Testing Checklist

- [ ] Test record with compliant schedule (should route for approval)
- [ ] Test record exceeding 30-day hour limit (should auto-reject)
- [ ] Test record with excessive consecutive days (should auto-reject)
- [ ] Test approval by manager (should update to approved)
- [ ] Test rejection by manager (should update to rejected)
- [ ] Verify notifications are sent to crew members
- [ ] Check scheduled job runs successfully
- [ ] Verify work_notes are properly logged

---

## Troubleshooting

### Flow Not Triggering
- Check scheduled trigger is active
- Verify flow is activated (not draft)
- Check system scheduler is running

### Records Not Processing
- Verify records have state = "availability_submitted"
- Check records are active
- Review Flow execution logs

### Optimization Errors
- Verify CrewScheduleOptimizer Script Include exists
- Check script logs: System Logs > Script Log Statements
- Ensure crew_member field is populated

### Approval Not Routing
- Verify "Reservations Manager" group exists
- Check group has active members
- Review approval_approver table

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/fluent/flows/crew-schedule-optimization-approval.now.ts` | Flow definition (Fluent API) |
| `src/fluent/flow-actions/run-schedule-optimization-compliance.now.ts` | Flow action (Fluent API) |
| `src/server/CrewScheduleOptimizer.js` | Core optimization logic |
| `src/server/flow-action-script-optimization.js` | Flow action script |
| `src/server/scheduled-job-crew-optimization.js` | Scheduled job alternative |
| `src/fluent/business-rules/crew-schedule-approval-handler.now.ts` | Approval handler |
| `src/fluent/tables/crew-schedule.now.ts` | Table definition |

---

## Next Steps

After implementation:
1. Configure notification email templates
2. Create dashboard for schedule monitoring
3. Add reporting for compliance metrics
4. Integrate with actual GenAI service (replace simulation)
5. Configure SLAs for approval response times

---

**Last Updated:** Current Implementation  
**Version:** 1.0  
**Status:** Ready for Implementation

