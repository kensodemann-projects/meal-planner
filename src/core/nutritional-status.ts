export type NutritionalStatus = 'low-danger' | 'low-warn' | 'in-zone' | 'high-warn' | 'high-danger';

export const rangeStatus = (
  value: number | null | undefined,
  min: number | null | undefined,
  max: number | null | undefined,
  tolerance: number | null | undefined,
): NutritionalStatus | null => {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value) ||
    min === null ||
    min === undefined ||
    Number.isNaN(min) ||
    max === null ||
    max === undefined ||
    Number.isNaN(max) ||
    tolerance === null ||
    tolerance === undefined ||
    Number.isNaN(tolerance)
  ) {
    return null;
  }

  const allowedDeviation = ((max + min) / 2) * (Math.max(tolerance, 0) / 100);
  if (value >= min && value <= max) {
    return 'in-zone';
  } else if (value < min && value >= min - allowedDeviation) {
    return 'low-warn';
  } else if (value > max && value <= max + allowedDeviation) {
    return 'high-warn';
  }
  return value < min ? 'low-danger' : 'high-danger';
};

export const maxOnlyStatus = (
  value: number | null | undefined,
  max: number | null | undefined,
  tolerance: number | null | undefined,
): NutritionalStatus | null => {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(value) ||
    max === null ||
    max === undefined ||
    Number.isNaN(max) ||
    tolerance === null ||
    tolerance === undefined ||
    Number.isNaN(tolerance)
  ) {
    return null;
  }

  const allowedDeviation = max * (Math.max(tolerance, 0) / 100);
  if (value <= max) {
    return 'in-zone';
  } else if (value <= max + allowedDeviation) {
    return 'high-warn';
  }
  return 'high-danger';
};
