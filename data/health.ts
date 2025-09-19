// data/health.ts

export type Workout = {
  id: string;
  type: string;                 // "Course", "Cyclisme", etc.
  durationMin: number;
  distanceKm?: number;
  paceMinPerKm?: number;
  kcal: number;
  dateISO: string;
};

export type PostureData = {
  assessmentDateISO?: string;   // date du dernier bilan capteurs
  riskScores?: {                // scores 0..1
    overall?: number;
    hips?: number;
    knees?: number;
    ankles?: number;
  };
  symmetry?: {                  // 0..1 (proximité de la cible) par côté
    left: number;
    right: number;
  };
  trends?: {
    balance7d?: number[];       // tendance équilibre unipodal (normalisée)
    hipAbd30s?: number[];       // reps abduction hanche en 30s
  };
  hips?: {
    romFlexionDeg?: number;     // amplitude flexion hanche (°)
    strengthNmKg?: number;      // force normalisée (Nm/kg)
  };
  knees?: {
    dynamicValgusDeg?: number;  // angle valgus dynamique (°)
    singleLegBalanceS?: number; // équilibre unipodal (s)
  };
  ankles?: {
    dorsiflexionLungeCm?: number; // test “knee to wall” (cm)
    hopTestSymmetry?: number;     // symétrie 0..1
  };
};

export type HealthData = {
  todayCalories: number;
  todaySteps: number;
  restingHr: number;
  hrv: number;
  lastNightSleepH: number;
  vo2max: number | string;
  steps7d: number[];
  rhr7d: number[];
  workouts: Workout[];
  lastAssessmentISO?: string;   // fallback si pas de posture.assessmentDateISO
  posture?: PostureData;        // 👈 section posture/capteurs
};

// --- MOCK: remplace avec tes vraies données capteurs
const DB: Record<string, HealthData> = {
  dev: {
    todayCalories: 2340,
    todaySteps: 8421,
    restingHr: 54,
    hrv: 62,
    lastNightSleepH: 7.4,
    vo2max: 50,
    steps7d: [8100, 9200, 7600, 10200, 9800, 11200, 8400],
    rhr7d: [56, 55, 54, 55, 54, 53, 54],
    lastAssessmentISO: "2025-09-12",
    workouts: [
      { id: "w1", type: "Course", durationMin: 42, distanceKm: 8.0, paceMinPerKm: 5.15, kcal: 540, dateISO: "2025-09-16" },
      { id: "w2", type: "Renfo", durationMin: 35, kcal: 280, dateISO: "2025-09-15" },
      { id: "w3", type: "Vélo", durationMin: 65, distanceKm: 24.3, kcal: 620, dateISO: "2025-09-14" },
    ],
    posture: {
      assessmentDateISO: "2025-09-17",
      riskScores: { overall: 0.74, hips: 0.71, knees: 0.58, ankles: 0.65 },
      symmetry: { left: 0.64, right: 0.72 },
      trends: { balance7d: [18, 20, 19, 22, 25, 24, 26], hipAbd30s: [26, 28, 27, 29, 31, 32, 33] },
      hips: { romFlexionDeg: 118, strengthNmKg: 2.35 },
      knees: { dynamicValgusDeg: 10, singleLegBalanceS: 24 },
      ankles: { dorsiflexionLungeCm: 9.5, hopTestSymmetry: 0.93 },
    },
  },
  blabla: {
    todayCalories: 2150,
    todaySteps: 10120,
    restingHr: 52,
    hrv: 68,
    lastNightSleepH: 7.9,
    vo2max: 52,
    steps7d: [9900, 10400, 8700, 12000, 11000, 12500, 10100],
    rhr7d: [54, 53, 52, 53, 52, 51, 52],
    lastAssessmentISO: "2025-09-13",
    workouts: [
      { id: "b1", type: "Course", durationMin: 50, distanceKm: 9.2, paceMinPerKm: 5.25, kcal: 610, dateISO: "2025-09-17" },
      { id: "b2", type: "Renfo", durationMin: 30, kcal: 250, dateISO: "2025-09-16" },
    ],
    posture: {
      assessmentDateISO: "2025-09-18",
      riskScores: { overall: 0.78, hips: 0.75, knees: 0.61, ankles: 0.7 },
      symmetry: { left: 0.69, right: 0.73 },
      trends: { balance7d: [22, 23, 24, 25, 25, 26, 27], hipAbd30s: [28, 29, 30, 31, 31, 32, 33] },
      hips: { romFlexionDeg: 120, strengthNmKg: 2.45 },
      knees: { dynamicValgusDeg: 8, singleLegBalanceS: 27 },
      ankles: { dorsiflexionLungeCm: 10.3, hopTestSymmetry: 0.96 },
    },
  },
};

export function getHealthData(login: string): HealthData {
  return DB[login] ?? DB.dev;
}
