export const validationRules = {
  required: (value: string | number | null | undefined) =>
    typeof value === 'number' ? true : !!value?.trim() || 'Required',
  email: (value: string) => /.+@.+\..+/.test(value) || 'Invalid e-mail',
};
