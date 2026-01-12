import type { FoodItem } from '@/models/food';
import type { FdcFoodItem } from '@/models/usda-fdc';
import { describe, expect, it } from 'vitest';
import { convertFdcFoodItem } from '../convert_fdc_food_item';

describe('Convert FDC Food item', () => {
  it.each([
    {
      testCase: 'egg product',
      input: {
        fdcId: 748967,
        description: 'Eggs, Grade A, Large, egg whole',
        foodNutrients: [
          {
            nutrient: { id: 1008, number: '208', name: 'Energy', rank: 300, unitName: 'kcal' },
            amount: 148.0,
          },
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 12.4,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 9.96,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 0.96,
          },
          {
            nutrient: { id: 1063, number: '269.3', name: 'Sugars, Total', rank: 1500, unitName: 'g' },
            amount: 0.2,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 129.0,
          },
        ],
        foodPortions: [
          {
            gramWeight: 50.3,
            amount: 1.0,
            measureUnit: { id: 1099, name: 'egg', abbreviation: 'egg' },
          },
          {
            gramWeight: 50.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 1, code: '0100', description: 'Dairy and Egg Products' },
      } as FdcFoodItem,
      expected: {
        fdcId: 748967,
        name: 'Eggs, Grade A, Large, egg whole',
        category: 'Dairy',
        calories: 148,
        protein: 12.4,
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        fat: 9.96,
        carbs: 0.96,
        sugar: 0.2,
        sodium: 129,
        alternativePortions: [
          {
            units: 1,
            unitOfMeasure: { id: 'item', name: 'Item', type: 'quantity', system: 'none', fdcId: 9999 },
            grams: 50.3,
            calories: 74.44,
            protein: 6.24,
            fat: 5.01,
            carbs: 0.48,
            sugar: 0.1,
            sodium: 64.89,
          },
        ],
      } as FoodItem,
    },
    {
      testCase: 'pork product',
      input: {
        fdcId: 2727575,
        description: 'Pork, chop, center cut, raw',
        foodNutrients: [
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 22.8125,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 5.475,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: -0.5625,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 39.3,
          },
        ],
        foodPortions: [
          {
            gramWeight: 110.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 10, code: '1000', description: 'Pork Products' },
      } as FdcFoodItem,
      expected: {
        fdcId: 2727575,
        name: 'Pork, chop, center cut, raw',
        category: 'Meats',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 22.8125,
        fat: 5.475,
        carbs: -0.5625,
        sodium: 39.3,
        sugar: 0,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'chicken product without nutrients',
      input: {
        fdcId: 2646170,
        description: 'Chicken, breast, boneless, skinless, raw',
        foodCategory: {
          id: 5,
          code: '0500',
          description: 'Poultry Products',
        },
        foodNutrients: [],
        foodPortions: [],
      } as FdcFoodItem,
      expected: {
        fdcId: 2646170,
        name: 'Chicken, breast, boneless, skinless, raw',
        category: 'Meats',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        sugar: 0,
        sodium: 0,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'salt',
      input: {
        fdcId: 746775,
        description: 'Salt, table, iodized',
        foodNutrients: [
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 38700.0,
          },
        ],
        foodPortions: [
          {
            gramWeight: 6.1,
            amount: 1.0,
            measureUnit: { id: 1002, name: 'teaspoon', abbreviation: 'tsp' },
          },
        ],
        foodCategory: { id: 2, code: '0200', description: 'Spices and Herbs' },
      } as FdcFoodItem,
      expected: {
        fdcId: 746775,
        name: 'Salt, table, iodized',
        category: 'Spices',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        sugar: 0,
        sodium: 38700,
        alternativePortions: [
          {
            units: 1,
            unitOfMeasure: { id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary', fdcId: 1002 },
            grams: 6.1,
            sodium: 2360.7,
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            sugar: 0,
          },
        ],
      } as FoodItem,
    },
    {
      testCase: 'sugar',
      input: {
        fdcId: 746784,
        description: 'Sugars, granulated',
        foodNutrients: [
          {
            nutrient: { id: 1008, number: '208', name: 'Energy', rank: 300, unitName: 'kcal' },
            amount: 385.0,
          },
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 0e-8,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 0.32,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 99.6,
          },
          {
            nutrient: { id: 1063, number: '269.3', name: 'Sugars, Total', rank: 1500, unitName: 'g' },
            amount: 99.8,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 1.0,
          },
        ],
        foodPortions: [
          {
            gramWeight: 4.0,
            amount: 1.0,
            measureUnit: { id: 1002, name: 'teaspoon', abbreviation: 'tsp' },
          },
          {
            gramWeight: 188.0,
            amount: 1.0,
            measureUnit: { id: 1000, name: 'cup', abbreviation: 'cup' },
          },
          {
            gramWeight: 8.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 19, code: '1900', description: 'Sweets' },
      },
      expected: {
        fdcId: 746784,
        name: 'Sugars, granulated',
        category: 'Sweets',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 385,
        protein: 0,
        fat: 0.32,
        carbs: 99.6,
        sugar: 99.8,
        sodium: 1,
        alternativePortions: [
          {
            units: 1,
            unitOfMeasure: { id: 'tsp', name: 'Teaspoon', type: 'volume', system: 'customary', fdcId: 1002 },
            grams: 4.0,
            calories: 15.4,
            protein: 0,
            fat: 0.01,
            carbs: 3.98,
            sugar: 3.99,
            sodium: 0.04,
          },
          {
            units: 1,
            unitOfMeasure: { id: 'cup', name: 'Cup', type: 'volume', system: 'customary', fdcId: 1000 },
            grams: 188.0,
            calories: 723.8,
            protein: 0,
            fat: 0.6,
            carbs: 187.25,
            sugar: 187.62,
            sodium: 1.88,
          },
        ],
      } as FoodItem,
    },
    {
      testCase: 'rice',
      input: {
        fdcId: 2512380,
        description: 'Rice, brown, long grain, unenriched, raw',
        foodNutrients: [
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 7.25305,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 3.306,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 76.68795,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 0e-8,
          },
        ],
        foodPortions: [
          {
            gramWeight: 45.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 20, code: '2000', description: 'Cereal Grains and Pasta' },
      } as FdcFoodItem,
      expected: {
        fdcId: 2512380,
        name: 'Rice, brown, long grain, unenriched, raw',
        category: 'Grains',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 7.25305,
        fat: 3.306,
        carbs: 76.68795,
        sugar: 0,
        sodium: 0,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'Almond flour',
      input: {
        fdcId: 2261420,
        description: 'Flour, almond',
        foodNutrients: [
          {
            type: 'FoodNutrient',
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 26.24375,
          },
          {
            type: 'FoodNutrient',
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 50.23,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 16.24925,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 0.8944,
          },
        ],
        foodPortions: [
          {
            gramWeight: 15.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 12, code: '1200', description: 'Nut and Seed Products' },
      } as FdcFoodItem,
      expected: {
        fdcId: 2261420,
        name: 'Flour, almond',
        category: 'Nuts & Seeds',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 26.24375,
        fat: 50.23,
        carbs: 16.24925,
        sugar: 0,
        sodium: 0.8944,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'apple',
      input: {
        fdcId: 1750342,
        description: 'Apples, granny smith, with skin, raw',
        foodNutrients: [
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 0.265625,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 0.1375,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 14.142975,
          },
          {
            nutrient: { id: 1063, number: '269.3', name: 'Sugars, Total', rank: 1500, unitName: 'g' },
            amount: 10.651,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 0e-8,
          },
        ],
        foodPortions: [
          {
            gramWeight: 140.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 9, code: '0900', description: 'Fruits and Fruit Juices' },
      } as FdcFoodItem,
      expected: {
        fdcId: 1750342,
        name: 'Apples, granny smith, with skin, raw',
        category: 'Produce',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 0.265625,
        fat: 0.1375,
        carbs: 14.142975,
        sugar: 10.651,
        sodium: 0,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'bread',
      input: {
        fdcId: 325871,
        description: 'Bread, white, commercially prepared',
        foodNutrients: [
          {
            nutrient: { id: 1008, number: '208', name: 'Energy', rank: 300, unitName: 'kcal' },
            amount: 270.0,
          },
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 9.43,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 3.59,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            id: 2238520,
            amount: 49.2,
          },
          {
            nutrient: { id: 1063, number: '269.3', name: 'Sugars, Total', rank: 1500, unitName: 'g' },
            amount: 5.34,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 477.0,
          },
        ],
        foodPortions: [
          {
            gramWeight: 27.3,
            amount: 1.0,
            measureUnit: { id: 1040, name: 'slice', abbreviation: 'slice' },
          },
          {
            gramWeight: 50.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 18, code: '1800', description: 'Baked Products' },
      } as FdcFoodItem,
      expected: {
        fdcId: 325871,
        name: 'Bread, white, commercially prepared',
        category: 'Bakery',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 270,
        protein: 9.43,
        fat: 3.59,
        carbs: 49.2,
        sugar: 5.34,
        sodium: 477,
        alternativePortions: [
          {
            units: 1,
            unitOfMeasure: { id: 'item', name: 'Item', type: 'quantity', system: 'none', fdcId: 9999 },
            grams: 27.3,
            calories: 73.71,
            protein: 2.57,
            fat: 0.98,
            carbs: 13.43,
            sugar: 1.46,
            sodium: 130.22,
          },
        ],
      } as FoodItem,
    },
    {
      testCase: 'carrot',
      input: {
        fdcId: 2258587,
        description: 'Carrots, baby, raw',
        foodNutrients: [
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 0.805,
          },
          {
            type: 'FoodNutrient',
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 0.1375,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 9.0787,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 62.66,
          },
        ],
        foodPortions: [
          {
            gramWeight: 85.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 11, code: '1100', description: 'Vegetables and Vegetable Products' },
      } as FdcFoodItem,
      expected: {
        fdcId: 2258587,
        name: 'Carrots, baby, raw',
        category: 'Produce',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 0.805,
        fat: 0.1375,
        carbs: 9.0787,
        sugar: 0,
        sodium: 62.66,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'Chicken',
      input: {
        fdcId: 2646170,
        description: 'Chicken, breast, boneless, skinless, raw',
        foodNutrients: [
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 22.525,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 1.934,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 0,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 65.75,
          },
        ],
        foodPortions: [
          {
            gramWeight: 114.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 5, code: '0500', description: 'Poultry Products' },
      } as FdcFoodItem,
      expected: {
        fdcId: 2646170,
        name: 'Chicken, breast, boneless, skinless, raw',
        category: 'Meats',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 22.525,
        fat: 1.934,
        carbs: 0,
        sugar: 0,
        sodium: 65.75,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'milk',
      input: {
        fdcId: 746776,
        description: 'Milk, nonfat, fluid, with added vitamin A and vitamin D (fat free or skim)',
        foodNutrients: [
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 3.43,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 0.08,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 4.92,
          },
        ],
        foodPortions: [
          {
            gramWeight: 246.0,
            amount: 1.0,
            measureUnit: { id: 1000, name: 'cup', abbreviation: 'cup' },
          },
        ],
        foodCategory: { id: 1, code: '0100', description: 'Dairy and Egg Products' },
      } as FdcFoodItem,
      expected: {
        fdcId: 746776,
        name: 'Milk, nonfat, fluid, with added vitamin A and vitamin D (fat free or skim)',
        category: 'Dairy',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 3.43,
        fat: 0.08,
        carbs: 4.92,
        sugar: 0,
        sodium: 0,
        alternativePortions: [
          {
            units: 1,
            unitOfMeasure: { id: 'cup', name: 'Cup', type: 'volume', system: 'customary', fdcId: 1000 },
            grams: 246.0,
            calories: 0,
            protein: 8.44,
            fat: 0.2,
            carbs: 12.1,
            sugar: 0,
            sodium: 0,
          },
        ],
      } as FoodItem,
    },
    {
      testCase: 'Lentils',
      input: {
        fdcId: 2644283,
        description: 'Lentils, dry',
        foodNutrients: [
          {
            nutrient: { id: 1003, number: '203', name: 'Protein', rank: 600, unitName: 'g' },
            amount: 23.56875,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 1.925,
          },
          {
            nutrient: { id: 1005, number: '205', name: 'Carbohydrate, by difference', rank: 1110, unitName: 'g' },
            amount: 62.17125,
          },
          {
            nutrient: { id: 1093, number: '307', name: 'Sodium, Na', rank: 5800, unitName: 'mg' },
            amount: 0e-8,
          },
        ],
        foodPortions: [
          {
            gramWeight: 35.0,
            amount: 1.0,
            measureUnit: { id: 1121, name: 'RACC', abbreviation: 'RACC' },
          },
        ],
        foodCategory: { id: 16, code: '1600', description: 'Legumes and Legume Products' },
      } as FdcFoodItem,
      expected: {
        fdcId: 2644283,
        name: 'Lentils, dry',
        category: 'Beans',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        alternativePortions: [],
        calories: 0,
        protein: 23.56875,
        fat: 1.925,
        carbs: 62.17125,
        sugar: 0,
        sodium: 0,
      } as FoodItem,
    },
    {
      testCase: 'olive oil (Fats & Oils)',
      input: {
        fdcId: 123456,
        description: 'Oil, olive, extra virgin',
        foodNutrients: [
          {
            nutrient: { id: 1008, number: '208', name: 'Energy', rank: 300, unitName: 'kcal' },
            amount: 884.0,
          },
          {
            nutrient: { id: 1004, number: '204', name: 'Total lipid (fat)', rank: 800, unitName: 'g' },
            amount: 100.0,
          },
        ],
        foodPortions: [],
        foodCategory: { id: 4, code: '0400', description: 'Fats and Oils' },
      } as FdcFoodItem,
      expected: {
        fdcId: 123456,
        name: 'Oil, olive, extra virgin',
        category: 'Fats & Oils',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 884,
        protein: 0,
        fat: 100,
        carbs: 0,
        sugar: 0,
        sodium: 0,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'frozen pizza (Mixed Foods)',
      input: {
        fdcId: 234567,
        description: 'Pizza, cheese, frozen',
        foodNutrients: [
          {
            nutrient: { id: 1008, number: '208', name: 'Energy', rank: 300, unitName: 'kcal' },
            amount: 266.0,
          },
        ],
        foodPortions: [],
        foodCategory: { id: 21, code: '2100', description: 'Fast Foods' },
      } as FdcFoodItem,
      expected: {
        fdcId: 234567,
        name: 'Pizza, cheese, frozen',
        category: 'Mixed Foods',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 266,
        protein: 0,
        fat: 0,
        carbs: 0,
        sugar: 0,
        sodium: 0,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'coffee (Beverages)',
      input: {
        fdcId: 345678,
        description: 'Coffee, brewed',
        foodNutrients: [
          {
            nutrient: { id: 1008, number: '208', name: 'Energy', rank: 300, unitName: 'kcal' },
            amount: 1.0,
          },
        ],
        foodPortions: [],
        foodCategory: { id: 14, code: '1400', description: 'Beverages' },
      } as FdcFoodItem,
      expected: {
        fdcId: 345678,
        name: 'Coffee, brewed',
        category: 'Beverages',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 1,
        protein: 0,
        fat: 0,
        carbs: 0,
        sugar: 0,
        sodium: 0,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'potato chips (Snacks)',
      input: {
        fdcId: 456789,
        description: 'Snacks, potato chips, plain',
        foodNutrients: [
          {
            nutrient: { id: 1008, number: '208', name: 'Energy', rank: 300, unitName: 'kcal' },
            amount: 536.0,
          },
        ],
        foodPortions: [],
        foodCategory: { id: 25, code: '2500', description: 'Snacks' },
      } as FdcFoodItem,
      expected: {
        fdcId: 456789,
        name: 'Snacks, potato chips, plain',
        category: 'Snacks',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 536,
        protein: 0,
        fat: 0,
        carbs: 0,
        sugar: 0,
        sodium: 0,
        alternativePortions: [],
      } as FoodItem,
    },
    {
      testCase: 'unknown category',
      input: {
        fdcId: 567890,
        description: 'Test food with unknown category',
        foodNutrients: [],
        foodPortions: [],
        foodCategory: { id: 99, code: '9999', description: 'Unknown Category' },
      } as FdcFoodItem,
      expected: {
        fdcId: 567890,
        name: 'Test food with unknown category',
        category: 'Unknown',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        sugar: 0,
        sodium: 0,
        alternativePortions: [],
      } as FoodItem,
    },
  ])('converts the base data for a $testCase', ({ input, expected }) => {
    expect(convertFdcFoodItem(input)).toEqual(expected);
  });
});
