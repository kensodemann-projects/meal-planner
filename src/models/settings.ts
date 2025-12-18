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
  weekStartDay: number;
}

/**
 * Default user settings with standard nutritional targets
 */
export const DEFAULT_SETTINGS: Settings = {
  calories: 2000,
  sugar: 50,
  protein: 75,
  tolerance: 10,
  cheatDays: 1,
  weekStartDay: 0, // Sunday
};
