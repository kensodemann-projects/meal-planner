export type NutritionalStatus = 'green' | 'yellow' | 'red';

export const rangeStatus = (
  value: number | null | undefined,
  min: number | null | undefined,
  max: number | null | undefined,
  tolerance: number | null | undefined,
): NutritionalStatus => {
  if (
    value === null ||
    value === undefined ||
    isNaN(value) ||
    min === null ||
    min === undefined ||
    isNaN(min) ||
    max === null ||
    max === undefined ||
    isNaN(max) ||
    tolerance === null ||
    tolerance === undefined ||
    isNaN(tolerance)
  ) {
    return 'red';
  }

  const allowedDeviation = ((max + min!) / 2) * (Math.max(tolerance, 0) / 100);
  if (value >= min && value <= max) {
    return 'green';
  } else if (value >= min - allowedDeviation && value <= max + allowedDeviation) {
    return 'yellow';
  }
  return 'red';
};

export const maxOnlyStatus = (
  value: number | null | undefined,
  max: number | null | undefined,
  tolerance: number | null | undefined,
): NutritionalStatus => {
  if (
    value === null ||
    value === undefined ||
    isNaN(value) ||
    max === null ||
    max === undefined ||
    isNaN(max) ||
    tolerance === null ||
    tolerance === undefined ||
    isNaN(tolerance)
  ) {
    return 'red';
  }

  const allowedDeviation = max * (Math.max(tolerance, 0) / 100);
  if (value <= max) {
    return 'green';
  } else if (value <= max + allowedDeviation) {
    return 'yellow';
  }
  return 'red';
};
