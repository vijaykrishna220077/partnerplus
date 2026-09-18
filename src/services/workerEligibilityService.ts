import { StructuredWorkerProfile, WorkerJobOpening, WorkerJobEligibilityResult } from '../types';
import { skillRegistry } from './cooperativeSkillRegistry';

/**
 * Worker Eligibility Engine for PartnerPlus Federation
 * Safely evaluates worker suitability against job requirements with 100% null safety.
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
    // Null safety guard
    if (!worker || !job) {
      return this.createRejectionResult('Worker profile or job opening details missing', 0);
    }

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

    // Normalize category / skill tags with full null-safety
    const rawCategory = job.serviceCategory || (job as any).category || '';
    const jobCategory = String(rawCategory).toLowerCase();

    const rawSpecificTask = job.specificTask || (job as any).title || job.serviceName || '';
    const jobSpecificTask = String(rawSpecificTask).toLowerCase();

    const jobSkillId = job.requiredSkillId || '';
    const expRequiredStr = job.experienceRequired || '';
    const minExpRequired = job.minimumExperienceYears ?? (
      expRequiredStr.includes('2+') ? 2 : expRequiredStr.includes('1+') ? 1 : 0
    );

    // Normalize worker skills
    const workerSkills = Array.isArray(worker.skills) ? worker.skills : [];

    // =========================================================================
    // 1. REQUIRED SKILL MATCH
    // =========================================================================
    const matchingSkill = workerSkills.find((ws) => {
      if (!ws) return false;
      if (jobSkillId && ws.skill_id === jobSkillId) return true;
      const wsName = String(ws.skill_name || ws.category || '').toLowerCase();
      if (jobCategory && wsName && (wsName.includes(jobCategory) || jobCategory.includes(wsName))) return true;
      if (job.requiredSkills && Array.isArray(job.requiredSkills)) {
        if (job.requiredSkills.some(rs => {
          const rsLower = String(rs || '').toLowerCase();
          const tasks = Array.isArray(ws.tasks) ? ws.tasks : [];
          return tasks.some(t => typeof t === 'string' && t.toLowerCase().includes(rsLower));
        })) return true;
      }
      if (job.workerTier === 'general' && ws.category === 'general') return true;
      return false;
    });

    const isRegulatedTrade = 
      jobCategory === 'electrical' || 
      jobCategory === 'plumbing' || 
      jobCategory === 'appliance_repair' ||
      jobSpecificTask.includes('wiring') ||
      jobSpecificTask.includes('mcb') ||
      jobSpecificTask.includes('short circuit');

    if (!matchingSkill) {
      if (job.workerTier === 'general' && (worker.worker_type === 'general' || workerSkills.some(s => s?.category === 'general'))) {
        skillMatchScore = 15;
        reasons.push('✓ General Labour & Assistance eligible');
      } else {
        eligible = false;
        rejectionReason = `Requires registered skill in ${job.serviceName || 'required trade'}. Not found in worker's registered trades.`;
        return this.createRejectionResult(rejectionReason, 0);
      }
    } else {
      if (matchingSkill.is_primary) {
        skillMatchScore = 30;
        reasons.push(`✓ Your primary trade: ${matchingSkill.skill_name || 'Trade'} (${(matchingSkill.skill_level || 'verified').toUpperCase()})`);
      } else {
        skillMatchScore = 22;
        reasons.push(`✓ Your verified additional trade: ${matchingSkill.skill_name || 'Trade'}`);
      }

      // Check task-level specific proficiency
      const tasks = Array.isArray(matchingSkill.tasks) ? matchingSkill.tasks : [];
      const hasSpecificTask = tasks.some((t) => {
        const tLower = typeof t === 'string' ? t.toLowerCase() : '';
        return Boolean(tLower && jobSpecificTask && (jobSpecificTask.includes(tLower) || tLower.includes(jobSpecificTask)));
      });
      if (hasSpecificTask) {
        skillMatchScore += 5;
        reasons.push(`✓ Specific competency confirmed: ${job.specificTask || job.serviceName || 'Task'}`);
      }
    }

    // =========================================================================
    // 2. WORKER TYPE COMPATIBILITY
    // =========================================================================
    if (job.workerTier === 'skilled') {
      if (worker.worker_type === 'general' && (!matchingSkill || !matchingSkill.verified)) {
        eligible = false;
        rejectionReason = `Specialized skilled trade (${job.serviceName || 'Service'}) requires certified artisan. General workers cannot take independent regulated work.`;
        return this.createRejectionResult(rejectionReason, 10);
      }
      workerTypeScore = 15;
    } else if (job.workerTier === 'semi_skilled') {
      workerTypeScore = 15;
      reasons.push('✓ Compatible worker tier (Helper / Assistant)');
    } else {
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
    const workerSkillExp = matchingSkill ? (matchingSkill.years_experience || 0) : (worker.experience_years || 0);
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
    const skillDef = job.serviceName ? skillRegistry.getSkillByName(job.serviceName) : null;
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
    const jobDist = typeof job.distanceKm === 'number' ? job.distanceKm : 3.5;
    if (jobDist > workerRadius) {
      eligible = false;
      rejectionReason = `Job distance (${jobDist} km) exceeds worker's service radius (${workerRadius} km)`;
      return this.createRejectionResult(rejectionReason, 40);
    } else {
      if (jobDist <= 2.0) {
        distanceScore = 15;
        reasons.push(`✓ Immediate neighbourhood (${jobDist} km away)`);
      } else if (jobDist <= 5.0) {
        distanceScore = 12;
        reasons.push(`✓ Nearby cluster (${jobDist} km, within ${workerRadius} km radius)`);
      } else {
        distanceScore = 8;
        reasons.push(`✓ Within service radius (${jobDist} km)`);
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
    if (!worker || !Array.isArray(allJobs)) return [];
    const results: Array<{ job: WorkerJobOpening; eligibility: WorkerJobEligibilityResult }> = [];

    for (const job of allJobs) {
      if (!job) continue;
      // Skip already filled jobs
      if (job.status === 'completed' || job.status === 'cancelled') continue;
      if (typeof job.workersAssigned === 'number' && typeof job.workersRequired === 'number' && job.workersAssigned >= job.workersRequired) continue;

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
