import { format } from 'date-fns';

export const dateToISO = (date: Date): string => format(date, 'yyyy-MM-dd');
