/**
 * Flow Action Script: Run Schedule Optimization and Compliance Check
 * Name: x_1603915_airspeed.run_schedule_optimization_compliance
 * 
 * This script runs inside a Flow Designer Scripted Action.
 * It simulates a GenAI/Optimization service for W2 requirements.
 * 
 * Inputs:
 * - inputs.crew_schedule_sys_id (String)
 * - inputs.crew_member (Reference)
 * - inputs.flight_number (String)
 * - inputs.start_date (GlideDate)
 * - inputs.end_date (GlideDate)
 * 
 * Outputs:
 * - outputs.optimized_duty_time (Integer)
 * - outputs.compliance_status (String)
 * - outputs.violation_details (String)
 */

(function execute(inputs, outputs) {
    
    // Use the CrewScheduleOptimizer Script Include
    var optimizer = new x_1603915_airspeed.CrewScheduleOptimizer();
    
    try {
        // Call the optimization engine
        var result = optimizer.optimizeSchedule(inputs.crew_schedule_sys_id);
        
        // Set outputs
        outputs.optimized_duty_time = result.optimized_duty_time;
        outputs.compliance_status = result.compliance_status;
        outputs.violation_details = result.violation_details;
        
        // Log the action
        gs.info('[Flow Action] Crew Schedule Optimization completed: ' + 
               'Schedule=' + inputs.crew_schedule_sys_id + 
               ', Status=' + result.compliance_status +
               ', Hours=' + result.optimized_duty_time);
        
    } catch (error) {
        // Handle errors
        gs.error('[Flow Action] Optimization error: ' + error);
        outputs.optimized_duty_time = 0;
        outputs.compliance_status = 'Violation';
        outputs.violation_details = 'Error during optimization: ' + error.toString();
    }
    
})(inputs, outputs);

