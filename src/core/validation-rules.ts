export const validationRules = {
  required: (value: string | number | object | null | undefined) => {
    if (typeof value === 'number') return true;
    if (typeof value === 'string') return !!value?.trim() || 'Required';
    return (value !== null && value !== undefined) || 'Required';
  },
  email: (value: string) => /.+@.+\..+/.test(value) || 'Invalid e-mail',
};
