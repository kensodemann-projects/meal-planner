export const validationRules = {
  required: (value: string | number | object | null | undefined) => {
    if (typeof value === 'number') return true;
    if (typeof value === 'string') return !!value?.trim() || 'Required';
    return (value !== null && value !== undefined) || 'Required';
  },
  email: (value: string | null | undefined) => !value?.trim() || /.+@.+\..+/.test(value) || 'Invalid e-mail',
  positive: (value: number | null | undefined) =>
    value === null || value === undefined || value > 0 || 'Must be a positive number',
  zeroOrGreater: (value: number | null | undefined) =>
    value === null || value === undefined || value >= 0 || 'Must be zero or greater',
};
