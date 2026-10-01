export const PRIORITY_LEVELS = {
  P1: 'P1',
  P2: 'P2',
  P3: 'P3',
};

export const PRIORITY_TYPES = {
  P1: 'ON_TIME_APPOINTMENT',
  P2: 'WALK_IN',
  P3: 'LATE_APPOINTMENT',
};

export const PRIORITY_LEVEL_LIST = Object.values(PRIORITY_LEVELS);

// Ranking priority order: P1 (Highest) -> P2 -> P3 (Lowest)
export const PRIORITY_RANKING = {
  [PRIORITY_LEVELS.P1]: 1,
  [PRIORITY_LEVELS.P2]: 2,
  [PRIORITY_LEVELS.P3]: 3,
};
