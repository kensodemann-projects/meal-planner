import type { FdcFoodItem, FdcFoodPortion, FoodCategory, FoodItem, Portion } from '@/models';
import { findUnitOfMeasure } from './unit-of-measure';

const fdcCategoryCodeToCategory = (code: string): FoodCategory => {
  switch (code) {
    case '0100':
      return 'Dairy';

    case '0200':
      return 'Spices';

    case '0400':
      return 'Fats & Oils';

    case '0500':
    case '0700':
    case '1000':
    case '1300':
    case '1500':
    case '1700':
      return 'Meats';

    case '0600':
    case '2100':
    case '2200':
    case '3500':
    case '3600':
      return 'Mixed Foods';

    case '0800':
    case '2000':
      return 'Grains';

    case '0900':
    case '1100':
      return 'Produce';

    case '1200':
      return 'Nuts & Seeds';

    case '1400':
    case '1410':
      return 'Beverages';

    case '1600':
      return 'Beans';

    case '1800':
      return 'Bakery';

    case '1900':
      return 'Sweets';

    case '2500':
      return 'Snacks';

    default:
      return 'Unknown';
  }
};

const lookupNutrient = (fdcFoodItem: FdcFoodItem, nutrientNumber: string): number | undefined => {
  const nutrient = fdcFoodItem.foodNutrients.find((n) => n.nutrient.number === nutrientNumber);
  return nutrient?.amount;
};

const addPortion = (foodItem: FoodItem, fdcFoodPortion: FdcFoodPortion) => {
  const portion: Portion = {
    units: fdcFoodPortion.amount,
    unitOfMeasure: findUnitOfMeasure(fdcFoodPortion.measureUnit.abbreviation),
    grams: fdcFoodPortion.gramWeight,
    calories: Number(((foodItem.calories * fdcFoodPortion.gramWeight) / 100).toFixed(2)),
    protein: Number(((foodItem.protein * fdcFoodPortion.gramWeight) / 100).toFixed(2)),
    fat: Number(((foodItem.fat * fdcFoodPortion.gramWeight) / 100).toFixed(2)),
    carbs: Number(((foodItem.carbs * fdcFoodPortion.gramWeight) / 100).toFixed(2)),
    sugar: Number(((foodItem.sugar * fdcFoodPortion.gramWeight) / 100).toFixed(2)),
    sodium: Number(((foodItem.sodium * fdcFoodPortion.gramWeight) / 100).toFixed(2)),
  };
  foodItem.alternativePortions.push(portion);
};

export const fromFdcToFoodItem = (fdcFoodItem: FdcFoodItem): FoodItem => {
  const foodItem: FoodItem = {
    fdcId: fdcFoodItem.fdcId,
    name: fdcFoodItem.description,
    units: 100,
    unitOfMeasure: findUnitOfMeasure('g'),
    grams: 100,
    category: fdcCategoryCodeToCategory(fdcFoodItem.foodCategory.code),
    calories: lookupNutrient(fdcFoodItem, '208') ?? 0,
    protein: lookupNutrient(fdcFoodItem, '203') ?? 0,
    fat: lookupNutrient(fdcFoodItem, '204') ?? 0,
    carbs: lookupNutrient(fdcFoodItem, '205') ?? 0,
    sugar: lookupNutrient(fdcFoodItem, '269.3') ?? 0,
    sodium: lookupNutrient(fdcFoodItem, '307') ?? 0,
    alternativePortions: [],
  };

  fdcFoodItem.foodPortions
    .filter((portion) => portion.measureUnit.abbreviation !== 'RACC')
    .forEach((fdcPortion) => addPortion(foodItem, fdcPortion));

  return foodItem;
};
