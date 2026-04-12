/**
 * Days of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * User settings for meal planning and nutritional goals
 */
export interface Settings {
  minDailyCalories: number;
  maxDailyCalories: number;
  minDailyProtein: number;
  maxDailyProtein: number;
  minDailyCarbs: number;
  maxDailyCarbs: number;
  minDailyFat: number;
  maxDailyFat: number;
  maxDailySugar: number;
  /**
   * Acceptable percentage deviation above a maximum or below a minimum for calorie and nutrient goals.
   * This is used to determine when to show warnings about exceeding limits or not meeting targets.
   * Must be between 0 and 100 (inclusive). Validation is performed at runtime when updating settings.
   */
  tolerance: number;
  /** First day of the week (0 = Sunday, 1 = Monday, etc.) */
  weekStartDay: WeekDay;
}
