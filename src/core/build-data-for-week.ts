import type { Settings } from '@/models/settings';
import { endOfWeek, format } from 'date-fns';
import { daysWithMeals, multiDayMealPlanNutrients } from '@/core/nutritional-calculations';
import type { WeeklyData } from '@/models/weekly-data';
import type { MealPlan } from '@/models/meal-plan';

const dateToISO = (date: Date): string => format(date, 'yyyy-MM-dd');

export const buildDataForWeek = async (
  startDate: Date,
  settings: Settings,
  getMealPlansForPeriod: (beginDt: string, endDt: string) => Promise<MealPlan[]>,
): Promise<WeeklyData> => {
  const endDate = endOfWeek(startDate, { weekStartsOn: settings.weekStartDay });
  const mealPlans = await getMealPlansForPeriod(dateToISO(startDate), dateToISO(endDate));
  const days = daysWithMeals(mealPlans);
  const nutrition = multiDayMealPlanNutrients(mealPlans);
  return {
    startDate,
    endDate,
    daysWithMeals: days,
    averageCalories: Math.round(nutrition.calories / (days || 1)),
    averageProtein: Math.round(nutrition.protein / (days || 1)),
    averageCarbs: Math.round(nutrition.carbs / (days || 1)),
  };
};
