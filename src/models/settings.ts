/**
 * Days of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * User settings for meal planning and nutritional goals
 */
export interface Settings {
  /** Daily calorie target in kcal */
  calories: number;
  /** Daily sugar limit in grams */
  sugar: number;
  /** Daily protein target in grams */
  protein: number;
  /**
   * Acceptable percentage deviation from nutritional targets before the day counts as a cheat day.
   * Must be between 0 and 100 (inclusive). Validation is performed at runtime when updating settings.
   */
  tolerance: number;
  /** Number of cheat days allowed per week */
  cheatDays: number;
  /** First day of the week (0 = Sunday, 1 = Monday, etc.) */
  weekStartDay: WeekDay;
}
