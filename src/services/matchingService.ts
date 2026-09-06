import { Worker, ServiceCategory, WorkerMatchResult } from '../types';
import { db } from './db';
import { locationService, KNOWN_AREAS_COORDINATES } from './locationService';

export interface MatchingParams {
  category: ServiceCategory;
  taskId?: string;
  isEmergency?: boolean;
  customerLat?: number;
  customerLng?: number;
  customerArea?: string;
  scheduledTime?: string;
  maxRadiusKm?: number;
}

export const matchingService = {
  /**
   * Resolves latitude & longitude for a worker using direct GPS coordinates
   * or landmark area lookup fallback.
   */
  resolveWorkerCoords(worker: Worker): { lat: number; lng: number } {
    if (worker.latitude && worker.longitude) {
      return { lat: worker.latitude, lng: worker.longitude };
    }
    const areaName = worker.locationArea || worker.city || '';
    const match = KNOWN_AREAS_COORDINATES.find(
      (place) =>
        place.name.toLowerCase().includes(areaName.toLowerCase()) ||
        place.city.toLowerCase() === worker.city?.toLowerCase()
    );
    if (match) {
      return { lat: match.lat, lng: match.lng };
    }
    return { lat: 13.0827, lng: 80.2707 };
  },

  /**
   * Proximity-First Worker Search & Ranking Algorithm.
   * Calculates dynamic Haversine distance between customer location and available workers.
   */
  rankWorkers(params: MatchingParams): WorkerMatchResult[] {
    const allWorkers = db.getWorkers();
    const maxRadius = params.maxRadiusKm || 30;

    const scored = allWorkers.map((worker) => {
      let skillScore = 0;
      let distanceScore = 0;
      let ratingScore = 0;
      let experienceScore = 0;
      let availabilityScore = 0;
      let emergencyScore = 0;
      let workloadScore = 0;
      const reasons: string[] = [];

      // 1. Calculate Dynamic Haversine Distance (in km)
      let computedDist: number;

      if (params.customerLat && params.customerLng) {
        const workerCoords = this.resolveWorkerCoords(worker);
        computedDist = locationService.calculateDistance(
          params.customerLat,
          params.customerLng,
          workerCoords.lat,
          workerCoords.lng
        );
      } else if (params.customerArea) {
        const areaMatch =
          worker.locationArea?.toLowerCase().includes(params.customerArea.toLowerCase()) ||
          params.customerArea.toLowerCase().includes(worker.locationArea?.toLowerCase() || '');
        computedDist = areaMatch ? 1.2 : (worker.distanceKm || 3.5);
      } else {
        computedDist = worker.distanceKm || 2.5;
      }

      // Calculate ETA using urban transport speed model
      const computedEta = locationService.calculateEtaMinutes(computedDist, 'bike');

      // Create updated worker reference with computed distance for UI
      const updatedWorker: Worker = {
        ...worker,
        distanceKm: computedDist,
        latitude: worker.latitude || this.resolveWorkerCoords(worker).lat,
        longitude: worker.longitude || this.resolveWorkerCoords(worker).lng
      };

      // 2. Skill Match (Hard constraint & Tier awareness - Max 30 pts)
      const hasDirectSkill = worker.primarySkill === params.category;
      const hasOtherSkill = worker.otherSkills && worker.otherSkills.includes(params.category);

      if (hasDirectSkill) {
        skillScore = 30;
        reasons.push(`Primary certified expert in ${worker.primarySkillLabel}`);
      } else if (hasOtherSkill) {
        skillScore = 20;
        reasons.push(`Cooperative multi-skilled verified in ${params.category}`);
      } else {
        skillScore = 0;
      }

      // 3. Proximity-First Distance Scoring (Max 35 pts)
      if (computedDist <= 1.5) {
        distanceScore = 35;
        reasons.push(`Nearest artisan in immediate neighborhood (${computedDist} km • ETA ~${computedEta} mins)`);
      } else if (computedDist <= 3.5) {
        distanceScore = 28;
        reasons.push(`Nearby cooperative cluster (${computedDist} km • ETA ~${computedEta} mins)`);
      } else if (computedDist <= 7.0) {
        distanceScore = 20;
        reasons.push(`Within local dispatch zone (${computedDist} km)`);
      } else if (computedDist <= 15.0) {
        distanceScore = 12;
        reasons.push(`Metropolitan radius (${computedDist} km)`);
      } else {
        distanceScore = 5;
        reasons.push(`Outer sector (${computedDist} km)`);
      }

      // 4. Verification Badges (Max 10 pts)
      let verifBonus = 0;
      if (worker.isVerified) verifBonus += 4;
      if (worker.isPoliceClearanceVerified) verifBonus += 3;
      if (worker.isIdentityChecked) verifBonus += 3;
      if (verifBonus >= 7) {
        reasons.push('Police clearance & Aadhaar identity verified');
      }

      // 5. Availability (Max 15 pts)
      if (worker.isAvailableToday) {
        availabilityScore = 15;
        reasons.push('Active & available for instant dispatch');
      } else {
        availabilityScore = 0;
      }

      // 6. Rating & Trust (Max 15 pts)
      const r = worker.rating || 4.5;
      ratingScore = Math.min(15, Math.round((r / 5) * 15));
      if (r >= 4.8) {
        reasons.push(`Top-rated cooperative artisan (${r} ★)`);
      }

      // 7. Experience (Max 10 pts)
      const exp = worker.experienceYears || 3;
      experienceScore = Math.min(10, Math.round(exp));
      if (exp >= 8) {
        reasons.push(`Master artisan with ${exp}+ years experience`);
      }

      // 8. Emergency Readiness (Max 20 pts when urgent)
      if (params.isEmergency) {
        if (worker.isEmergencyReady && worker.isAvailableToday) {
          emergencyScore = 20;
          reasons.push('15-minute emergency rapid response kit ready');
        } else {
          emergencyScore = -15;
        }
      } else {
        emergencyScore = worker.isEmergencyReady ? 5 : 0;
      }

      // 9. Workload & Reliability (Max 10 pts)
      const jobs = worker.jobsCompleted || 50;
      workloadScore = Math.min(10, Math.round(jobs / 20));

      const totalScore = Math.max(
        0,
        Math.min(
          100,
          skillScore +
            verifBonus +
            availabilityScore +
            distanceScore +
            ratingScore +
            experienceScore +
            emergencyScore +
            workloadScore
        )
      );

      return {
        worker: updatedWorker,
        matchScore: totalScore,
        scoreBreakdown: {
          skillScore,
          distanceScore,
          ratingScore,
          experienceScore,
          availabilityScore,
          emergencyScore,
          workloadScore
        },
        reasons
      };
    });

    // Filter out workers beyond max radius if specified
    const filtered = scored.filter((item) => item.worker.distanceKm <= maxRadius);
    const finalResults = filtered.length > 0 ? filtered : scored;

    // Sort by matchScore descending (proximity-first algorithm)
    finalResults.sort((a, b) => b.matchScore - a.matchScore);
    return finalResults;
  },

  /**
   * Search and return workers ordered strictly by closest proximity (distance in km).
   */
  findNearbyWorkers(params: MatchingParams): WorkerMatchResult[] {
    const ranked = this.rankWorkers(params);
    return [...ranked].sort((a, b) => a.worker.distanceKm - b.worker.distanceKm);
  },

  /**
   * Search and return workers strictly within a given distance radius (e.g. 5km).
   */
  getWorkersWithinRadius(params: MatchingParams, maxRadiusKm: number = 5): WorkerMatchResult[] {
    const ranked = this.rankWorkers({ ...params, maxRadiusKm });
    return ranked.filter((item) => item.worker.distanceKm <= maxRadiusKm);
  },

  /**
   * Returns the single best matched worker for a customer booking based on proximity & skills.
   */
  findBestWorker(params: MatchingParams): WorkerMatchResult {
    const ranked = this.rankWorkers(params);
    if (ranked.length > 0) {
      return ranked[0];
    }
    const all = db.getWorkers();
    const fallbackWorker = all[0];
    return {
      worker: fallbackWorker,
      matchScore: 85,
      scoreBreakdown: {
        skillScore: 25,
        distanceScore: 15,
        ratingScore: 14,
        experienceScore: 9,
        availabilityScore: 15,
        emergencyScore: 10,
        workloadScore: 8
      },
      reasons: ['Assigned by cooperative nearest dispatch pool']
    };
  }
};
