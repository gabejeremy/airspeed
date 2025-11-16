# Quick Start Guide - Crew Schedule Flow

This is a quick reference for getting the Crew Schedule Optimization and Approval Flow up and running.

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] ServiceNow instance (Orlando or later)
- [ ] AI-Rspeed application installed (scope: x_1603915_airspeed)
- [ ] Crew Schedule table created
- [ ] Admin or Flow Designer access

---

## 5-Minute Setup

### Step 1: Create User Group (1 min)
```
Navigate to: User Administration > Groups
Click: New
Name: Reservations Manager
Save
Add: 1-2 managers to the group
```

### Step 2: Deploy Script Include (2 min)
```
Navigate to: System Definition > Script Includes
Click: New
Name: CrewScheduleOptimizer
Application: AI-Rspeed: Flight Orchestration
API Name: x_1603915_airspeed.CrewScheduleOptimizer
Client callable: false
Paste code from: src/server/CrewScheduleOptimizer.js
Submit
```

### Step 3: Choose Implementation Path (2 min)

#### Option A: Flow Designer (Recommended)
Follow the detailed guide in `flow-designer-implementation-guide.md`

#### Option B: Quick Scheduled Job (Faster)
```
Navigate to: System Scheduler > Scheduled Jobs
Click: New
Name: Daily Crew Schedule Optimization
Run: Daily at 06:00:00
Paste code from: src/server/scheduled-job-crew-optimization.js
Submit and Activate
```

### Step 4: Create Business Rule (Optional but Recommended)
```
Navigate to: System Definition > Business Rules
Click: New
Name: Crew Schedule Approval Handler
Table: Approval [sysapproval_approver]
When: after
Update: true
Paste code from the TypeScript file (convert to JS if needed)
Submit
```

---

## Quick Test

### Test Case 1: Compliant Schedule (Should Approve)
1. Create Crew Schedule record:
   - Crew Member: Any user
   - Flight Number: "AA123"
   - Start Date: Tomorrow
   - End Date: 2 days from now
   - State: "availability_submitted"
2. Run scheduled job or trigger flow
3. Expected: State → "draft_schedule", then routes for approval

### Test Case 2: Violation (Should Reject)
1. Create 10 Crew Schedule records for same crew member:
   - All with state "approved_schedule"
   - All within last 30 days
   - Each with optimized_duty_time = 15 hours
2. Create new record with state "availability_submitted"
3. Run scheduled job or trigger flow
4. Expected: State → "rejected" (exceeds 100 hours in 30 days)

---

## Verification

Check these after running:

```javascript
// Check processing log
Navigate to: System Logs > Script Log Statements
Filter: Contains "Crew Schedule"

// Check approval records
Navigate to: Service Automation > Approvals > Approval Records
Filter: Source table = Crew Schedule

// Check notifications
Navigate to: System Notifications > Email > Sent
Filter: Subject contains "Crew Schedule"
```

---

## Troubleshooting

### "CrewScheduleOptimizer is not defined"
**Fix:** Create the Script Include (Step 2)

### "Reservations Manager group not found"
**Fix:** Create the group (Step 1)

### Records not processing
**Check:**
- State is exactly "availability_submitted"
- Record is active (active = true)
- Scheduled job is active
- Flow is activated (if using Flow Designer)

### Compliance always shows violation
**Check:**
- start_date and end_date are valid dates
- crew_member field is populated
- No data quality issues

---

## Key State Values

| State | Meaning | Next Action |
|-------|---------|-------------|
| availability_submitted | Crew submitted availability | Auto-processed by flow |
| draft_schedule | Optimization complete | Waiting for approval |
| approved_schedule | Manager approved | Final state |
| rejected | Violation or manager rejected | Crew resubmits |

---

## Support Files

| Document | Purpose |
|----------|---------|
| `flow-designer-implementation-guide.md` | Detailed Flow Designer setup |
| `development-progress.md` | Complete project history |
| This file | Quick reference |

---

## Need Help?

**Common Issues:**
1. **Can't see Flow Designer:** Check role assignments (flow_designer)
2. **Approvals not working:** Verify Reservations Manager group exists
3. **Script errors:** Check System Logs for detailed error messages
4. **Dates not calculating:** Ensure date format is YYYY-MM-DD

**Best Practices:**
- Test with sample data first
- Monitor System Logs during first runs
- Start with Option B (Scheduled Job) for faster testing
- Migrate to Flow Designer for production (better visibility)

---

## Production Checklist

Before going live:

- [ ] Test all compliance rules with various scenarios
- [ ] Verify notification templates are configured
- [ ] Set up error monitoring/alerting
- [ ] Document approval process for managers
- [ ] Train crew on portal usage
- [ ] Create backup of working configuration
- [ ] Schedule regular compliance audits
- [ ] Monitor performance for large record sets

---

**Quick Start Complete!** 🚀

For detailed implementation, see `flow-designer-implementation-guide.md`

