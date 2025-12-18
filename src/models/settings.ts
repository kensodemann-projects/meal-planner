export interface Settings {
  calories: number;
  sugars: number;
  proteins: number;
  tolerance: number;
  cheatDays: number;
  weekStartDay: number;
}

export const DEFAULT_SETTINGS: Settings = {
  calories: 2000,
  sugars: 50,
  proteins: 75,
  tolerance: 10,
  cheatDays: 1,
  weekStartDay: 0, // Sunday
};
