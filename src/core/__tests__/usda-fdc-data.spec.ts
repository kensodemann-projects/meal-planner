import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { FdcFoodItem, FdcFoodSearchResult } from '@/models';
import { fetchFoodItem, searchFdcData } from '../usda-fdc-data';

global.fetch = vi.fn();

describe('USDA FDC Data', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('searchFdcData', () => {
    it('makes a GET request to USDA FDC API with correct parameters', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 1,
        currentPage: 1,
        foodSearchCriteria: { query: 'apple' },
        foods: [
          { fdcId: 123, description: 'Apple, raw', foodCategory: 'Fruits & Juices' },
          { fdcId: 456, description: 'Apple juice', foodCategory: 'Fruits & Juices' },
        ],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchFdcData('apple');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&dataType=Foundation&pageSize=25&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=lH3yRDraY43gGXZUbP6bGbdidhAHNetvtPvZNDum',
      );
    });

    it('sets the page number if passed', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 1,
        currentPage: 1,
        foodSearchCriteria: { query: 'apple' },
        foods: [
          { fdcId: 123, description: 'Apple, raw', foodCategory: 'Fruits & Juices' },
          { fdcId: 456, description: 'Apple juice', foodCategory: 'Fruits & Juices' },
        ],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchFdcData('apple', 2);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&dataType=Foundation&pageSize=25&pageNumber=2&sortBy=dataType.keyword&sortOrder=asc&api_key=lH3yRDraY43gGXZUbP6bGbdidhAHNetvtPvZNDum',
      );
    });

    it('properly encodes special characters in query', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 0,
        currentPage: 0,
        foodSearchCriteria: { query: 'chicken & rice' },
        foods: [],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchFdcData('chicken & rice');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.nal.usda.gov/fdc/v1/foods/search?query=chicken%20%26%20rice&dataType=Foundation&pageSize=25&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=lH3yRDraY43gGXZUbP6bGbdidhAHNetvtPvZNDum',
      );
    });

    it('returns the JSON from the response', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 1,
        currentPage: 1,
        foodSearchCriteria: { query: 'apple' },
        foods: [
          { fdcId: 123, description: 'Apple, raw', foodCategory: 'Fruits & Juices' },
          { fdcId: 456, description: 'Apple juice', foodCategory: 'Fruits & Juices' },
        ],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchFdcData('apple');

      expect(result).toEqual(mockResponse);
    });

    it('throws error when API response is not ok', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(searchFdcData('apple')).rejects.toThrow('Failed to fetch USDA FDC data');
    });

    it('throws an error when API returns invalid JSON', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(searchFdcData('apple')).rejects.toThrow('Invalid JSON');
    });

    it('handles empty query string', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 0,
        currentPage: 0,
        foodSearchCriteria: { query: '' },
        foods: [],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchFdcData('');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.nal.usda.gov/fdc/v1/foods/search?query=&dataType=Foundation&pageSize=25&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=lH3yRDraY43gGXZUbP6bGbdidhAHNetvtPvZNDum',
      );
    });
  });

  describe('fetchFoodItem', () => {
    it('makes a GET request to USDA FDC API with correct parameters', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => TEST_FDC_FOOD_ITEM,
      });

      await fetchFoodItem(748967);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.nal.usda.gov/fdc/v1/food/748967?api_key=lH3yRDraY43gGXZUbP6bGbdidhAHNetvtPvZNDum&nutrients=203&nutrients=204&nutrients=205&nutrients=208&nutrients=269.3&nutrients=307',
      );
    });

    it('throws error when API response is not ok', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(fetchFoodItem(748967)).rejects.toThrow('Failed to fetch USDA FDC data');
    });

    it('throws an error when API returns invalid JSON', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(fetchFoodItem(748967)).rejects.toThrow('Invalid JSON');
    });

    it('converts the FDC food item to FoodItem format', async () => {
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => TEST_FDC_FOOD_ITEM,
      });

      const item = await fetchFoodItem(748967);

      expect(item).toEqual({
        fdcId: 748967,
        name: 'Eggs, Grade A, Large, egg whole',
        category: 'Dairy',
        units: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 148,
        protein: 12.4,
        fat: 9.96,
        carbs: 0.96,
        sugar: 0.2,
        sodium: 129,
        alternativePortions: [
          {
            units: 1,
            unitOfMeasure: { id: 'item', name: 'Item', type: 'quantity', system: 'none' },
            grams: 50.3,
            calories: 74.44,
            protein: 6.24,
            fat: 5.01,
            carbs: 0.48,
            sugar: 0.1,
            sodium: 64.89,
          },
        ],
      });
    });
  });
});

const TEST_FDC_FOOD_ITEM: FdcFoodItem = {
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
      measureUnit: { name: 'egg', abbreviation: 'egg' },
    },
    {
      gramWeight: 50.0,
      amount: 1.0,
      measureUnit: { name: 'RACC', abbreviation: 'RACC' },
    },
  ],
  foodCategory: { id: 1, code: '0100', description: 'Dairy and Egg Products' },
};
