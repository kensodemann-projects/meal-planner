import type { FdcFoodItem, FoodCategory, FoodItem } from '@/models';

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
      return 'Meats';

    case '0600':
    case '2100':
    case '2500':
    case '3500':
      return 'Mixed Foods';

    case '2000':
      return 'Grains';

    case '0900':
    case '1100':
      return 'Produce';

    case '1200':
      return 'Nuts & Seeds';

    case '1400':
      return 'Beverages';

    case '1600':
      return 'Beans';

    case '1700':
    case '1800':
      return 'Bakery';

    case '1900':
      return 'Sweets';

    case '2200':
      return 'Snacks';

    default:
      return 'Unknown';
  }
};

const lookupNutrient = (fdcFoodItem: FdcFoodItem, nutrientNumber: string): number | undefined => {
  const nutrient = fdcFoodItem.foodNutrients.find((n) => n.nutrient.number === nutrientNumber);
  return nutrient?.amount;
};

const fromFdcToFoodItem = (fdcFoodItem: FdcFoodItem): FoodItem => {
  return {
    fdcId: fdcFoodItem.fdcId,
    name: fdcFoodItem.description,
    category: fdcCategoryCodeToCategory(fdcFoodItem.foodCategory.code),
    servingSize: 100,
    unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
    grams: 100,
    calories: lookupNutrient(fdcFoodItem, '208') ?? 0,
    protein: lookupNutrient(fdcFoodItem, '203') ?? 0,
    fat: lookupNutrient(fdcFoodItem, '204') ?? 0,
    carbs: lookupNutrient(fdcFoodItem, '205') ?? 0,
    sugar: lookupNutrient(fdcFoodItem, '269.3') ?? 0,
    sodium: lookupNutrient(fdcFoodItem, '307') ?? 0,
  };
};

export const useConverters = () => ({
  fromFdcToFoodItem,
});
