import { 
  StructuredWorkerProfile, 
  WorkerJobEligibilityResult 
} from '../types/workerSkillRegistry';
import { WorkerJobOpening } from '../data/workerJobData';
import { skillRegistry } from './cooperativeSkillRegistry';

/**
 * Skill-Based Worker Eligibility & Fair Opportunity Matching Engine
 * Evaluates candidate workers against job openings in strictly defined 10-step hierarchy:
 * 1. Required Skill Match
 * 2. Worker Type Compatibility
 * 3. Required Experience
 * 4. Availability
 * 5. Emergency Availability (if emergency job)
 * 6. Verification Status
 * 7. Distance & Service Radius
 * 8. Current Workload
 * 9. Rating
 * 10. Fair Distribution of Opportunities
 */
export const workerEligibilityService = {
  /**
   * Evaluates if a given worker is eligible for a job opening,
   * calculating a suitability score and generating human-readable "Why this matches you" reasons.
   */
  evaluateWorkerEligibility(
    worker: StructuredWorkerProfile,
    job: WorkerJobOpening,
    isCurrentlyOccupied: boolean = false
  ): WorkerJobEligibilityResult {
    const reasons: string[] = [];
    let eligible = true;
    let rejectionReason: string | undefined = undefined;

    // Sub-scores
    let skillMatchScore = 0;
    let workerTypeScore = 0;
    let experienceScore = 0;
    let availabilityScore = 0;
    let emergencyScore = 0;
    let verificationScore = 0;
    let distanceScore = 0;
    let workloadScore = 0;
    let ratingScore = 0;
    let fairDistributionScore = 0;

    // Normalize category / skill tags
    const jobCategory = job.serviceCategory.toLowerCase();
    const jobSkillId = job.requiredSkillId || '';
    const jobSpecificTask = job.specificTask.toLowerCase();
    const minExpRequired = job.minimumExperienceYears ?? (
      job.experienceRequired.includes('2+') ? 2 : job.experienceRequired.includes('1+') ? 1 : 0
    );

    // =========================================================================
    // 1. REQUIRED SKILL MATCH
    // =========================================================================
    // Check if worker has matching skill in their registered skills
    const matchingSkill = worker.skills.find((ws) => {
      if (jobSkillId && ws.skill_id === jobSkillId) return true;
      const wsName = ws.skill_name.toLowerCase();
      if (wsName.includes(jobCategory) || jobCategory.includes(wsName)) return true;
      if (job.requiredSkills && job.requiredSkills.some(rs => ws.tasks.some(t => t.toLowerCase().includes(rs.toLowerCase())))) return true;
      // Also check general worker broad compatibility
      if (job.workerTier === 'general' && ws.category === 'general') return true;
      return false;
    });

    const isRegulatedTrade = 
      jobCategory === 'electrical' || 
      jobCategory === 'plumbing' || 
      jobCategory === 'appliance_repair' ||
      job.specificTask.toLowerCase().includes('wiring') ||
      job.specificTask.toLowerCase().includes('mcb') ||
      job.specificTask.toLowerCase().includes('short circuit');

    if (!matchingSkill) {
      // General worker exception: If job is a GENERAL job (moving, cleaning, loading),
      // and worker is GENERAL or has household helper, allow it.
      if (job.workerTier === 'general' && (worker.worker_type === 'general' || worker.skills.some(s => s.category === 'general'))) {
        skillMatchScore = 15;
        reasons.push('✓ General Labour & Assistance eligible');
      } else {
        eligible = false;
        rejectionReason = `Requires registered skill in ${job.serviceName}. Not found in worker's registered trades.`;
        return this.createRejectionResult(rejectionReason, 0);
      }
    } else {
      if (matchingSkill.is_primary) {
        skillMatchScore = 30;
        reasons.push(`✓ Your primary trade: ${matchingSkill.skill_name} (${matchingSkill.skill_level.toUpperCase()})`);
      } else {
        skillMatchScore = 22;
        reasons.push(`✓ Your verified additional trade: ${matchingSkill.skill_name}`);
      }

      // Check task-level specific proficiency
      const hasSpecificTask = matchingSkill.tasks.some((t) => 
        jobSpecificTask.includes(t.toLowerCase()) || t.toLowerCase().includes(jobSpecificTask)
      );
      if (hasSpecificTask) {
        skillMatchScore += 5;
        reasons.push(`✓ Specific competency confirmed: ${job.specificTask}`);
      }
    }

    // =========================================================================
    // 2. WORKER TYPE COMPATIBILITY
    // =========================================================================
    // Rule: General worker MUST NOT receive regulated skilled work without verified skill
    if (job.workerTier === 'skilled') {
      if (worker.worker_type === 'general' && (!matchingSkill || !matchingSkill.verified)) {
        eligible = false;
        rejectionReason = `Specialized skilled trade (${job.serviceName}) requires certified artisan. General workers cannot take independent regulated work.`;
        return this.createRejectionResult(rejectionReason, 10);
      }
      workerTypeScore = 15;
    } else if (job.workerTier === 'semi_skilled') {
      // Semi-skilled helper jobs are open to semi-skilled and skilled artisans
      workerTypeScore = 15;
      reasons.push('✓ Compatible worker tier (Helper / Assistant)');
    } else {
      // General jobs are open to general workers and anyone willing to do manual assistance
      workerTypeScore = 15;
      reasons.push('✓ General cooperative opportunity open to all members');
    }

    // High risk / regulated check
    if (isRegulatedTrade && (!matchingSkill || !matchingSkill.verified)) {
      eligible = false;
      rejectionReason = `Regulated electrical/gas/plumbing task requires safety verified credentials.`;
      return this.createRejectionResult(rejectionReason, 10);
    }

    // =========================================================================
    // 3. REQUIRED EXPERIENCE
    // =========================================================================
    const workerSkillExp = matchingSkill ? matchingSkill.years_experience : worker.experience_years;
    if (minExpRequired > 0 && workerSkillExp < minExpRequired) {
      eligible = false;
      rejectionReason = `Requires ${minExpRequired}+ years experience. Worker has ${workerSkillExp} years.`;
      return this.createRejectionResult(rejectionReason, 20);
    } else {
      experienceScore = Math.min(15, 8 + workerSkillExp * 1.5);
      reasons.push(`✓ Experience match: ${workerSkillExp} years (Min required: ${minExpRequired || 0} yr)`);
    }

    // =========================================================================
    // 4. AVAILABILITY
    // =========================================================================
    if (!worker.availability_status) {
      eligible = false;
      rejectionReason = 'Worker is currently offline / off duty';
      return this.createRejectionResult(rejectionReason, 25);
    } else {
      availabilityScore = 15;
      reasons.push('✓ Currently on live duty & available today');
    }

    // =========================================================================
    // 5. EMERGENCY AVAILABILITY (IF EMERGENCY JOB)
    // =========================================================================
    if (job.urgency === 'emergency') {
      if (!worker.emergency_available) {
        eligible = false;
        rejectionReason = 'Emergency request requires worker to have Emergency Duty enabled';
        return this.createRejectionResult(rejectionReason, 30);
      } else {
        emergencyScore = 15;
        reasons.push('✓ Emergency response kit ready (<15 min response)');
      }
    } else {
      emergencyScore = 5;
    }

    // =========================================================================
    // 6. VERIFICATION STATUS
    // =========================================================================
    const skillDef = skillRegistry.getSkillByName(job.serviceName);
    const verificationMandatory = skillDef ? skillDef.verification_required : isRegulatedTrade;

    if (verificationMandatory) {
      const isVerified = matchingSkill ? matchingSkill.verified : worker.verification_status === 'verified';
      if (!isVerified) {
        eligible = false;
        rejectionReason = 'Job requires cooperative verified skill credentials';
        return this.createRejectionResult(rejectionReason, 35);
      } else {
        verificationScore = 10;
        reasons.push('✓ Cooperative police clearance & identity verified');
      }
    } else {
      verificationScore = 10;
    }

    // =========================================================================
    // 7. DISTANCE & SERVICE RADIUS
    // =========================================================================
    const workerRadius = worker.service_radius_km || 10;
    if (job.distanceKm > workerRadius) {
      eligible = false;
      rejectionReason = `Job distance (${job.distanceKm} km) exceeds worker's service radius (${workerRadius} km)`;
      return this.createRejectionResult(rejectionReason, 40);
    } else {
      // Closer jobs get higher points
      if (job.distanceKm <= 2.0) {
        distanceScore = 15;
        reasons.push(`✓ Immediate neighbourhood (${job.distanceKm} km away)`);
      } else if (job.distanceKm <= 5.0) {
        distanceScore = 12;
        reasons.push(`✓ Nearby cluster (${job.distanceKm} km, within ${workerRadius} km radius)`);
      } else {
        distanceScore = 8;
        reasons.push(`✓ Within service radius (${job.distanceKm} km)`);
      }
    }

    // =========================================================================
    // 8. CURRENT WORKLOAD
    // =========================================================================
    if (isCurrentlyOccupied) {
      eligible = false;
      rejectionReason = 'Worker is currently engaged on an active job';
      return this.createRejectionResult(rejectionReason, 45);
    } else {
      workloadScore = 10;
    }

    // =========================================================================
    // 9. RATING SCORE
    // =========================================================================
    const rating = worker.rating || 4.5;
    ratingScore = Math.min(10, Math.round((rating / 5) * 10));
    if (rating >= 4.8) {
      reasons.push(`✓ High-rated cooperative member (${rating} ★)`);
    }

    // =========================================================================
    // 10. FAIR DISTRIBUTION OF OPPORTUNITIES
    // =========================================================================
    // Members with fewer recent jobs get a priority boost to prevent work monopoly!
    const opportunities = worker.opportunities_received_count || 30;
    if (opportunities < 25) {
      fairDistributionScore = 10;
      reasons.push('✓ Cooperative equitable dispatch priority boost');
    } else if (opportunities < 50) {
      fairDistributionScore = 7;
      reasons.push('✓ Fair opportunity quota active');
    } else {
      fairDistributionScore = 4;
    }

    // Calculate composite suitability score (0 - 100)
    const rawTotal = 
      skillMatchScore +
      workerTypeScore +
      experienceScore +
      availabilityScore +
      emergencyScore +
      verificationScore +
      distanceScore +
      workloadScore +
      ratingScore +
      fairDistributionScore;

    const suitabilityScore = Math.min(100, Math.max(0, Math.round(rawTotal * 0.7)));

    return {
      eligible,
      suitabilityScore,
      reasons,
      scoreBreakdown: {
        skillMatchScore,
        workerTypeScore,
        experienceScore,
        availabilityScore,
        emergencyScore,
        verificationScore,
        distanceScore,
        workloadScore,
        ratingScore,
        fairDistributionScore
      }
    };
  },

  /**
   * Helper to construct rejection result
   */
  createRejectionResult(reason: string, score: number): WorkerJobEligibilityResult {
    return {
      eligible: false,
      suitabilityScore: score,
      reasons: [],
      rejectionReason: reason,
      scoreBreakdown: {
        skillMatchScore: 0,
        workerTypeScore: 0,
        experienceScore: 0,
        availabilityScore: 0,
        emergencyScore: 0,
        verificationScore: 0,
        distanceScore: 0,
        workloadScore: 0,
        ratingScore: 0,
        fairDistributionScore: 0
      }
    };
  },

  /**
   * Filter and rank available jobs for a specific worker
   */
  getEligibleJobsForWorker(
    worker: StructuredWorkerProfile,
    allJobs: WorkerJobOpening[],
    isCurrentlyOccupied: boolean = false
  ): Array<{ job: WorkerJobOpening; eligibility: WorkerJobEligibilityResult }> {
    const results: Array<{ job: WorkerJobOpening; eligibility: WorkerJobEligibilityResult }> = [];

    for (const job of allJobs) {
      // Skip already filled jobs
      if (job.status === 'completed' || job.status === 'cancelled') continue;
      if (job.workersAssigned >= job.workersRequired) continue;

      const eligibility = this.evaluateWorkerEligibility(worker, job, isCurrentlyOccupied);
      if (eligibility.eligible) {
        results.push({ job, eligibility });
      }
    }

    // Sort by suitability score descending
    results.sort((a, b) => b.eligibility.suitabilityScore - a.eligibility.suitabilityScore);
    return results;
  }
};
