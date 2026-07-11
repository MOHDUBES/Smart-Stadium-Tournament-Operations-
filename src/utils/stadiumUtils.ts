export interface Gate {
  id: string;
  name: string;
  waitTimeMinutes: number;
  capacityPercent: number;
}

/**
 * Returns the gate with the highest wait time.
 */
export const getWorstWaitTimeGate = (gates: Gate[]): Gate | undefined => {
  if (!gates || gates.length === 0) return undefined;
  return [...gates].sort((a, b) => b.waitTimeMinutes - a.waitTimeMinutes)[0];
};

/**
 * Returns a color code based on the capacity percentage.
 * Green < 50%, Amber 50-80%, Red > 80%
 */
export const getCapacityColor = (capacityPercent: number): string => {
  if (capacityPercent > 80) return '#ef4444'; // Red
  if (capacityPercent > 50) return '#f59e0b'; // Amber
  return '#7ED957'; // Green
};
