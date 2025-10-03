import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useFdcData } from '../usda-fdc-data';
import type { FdcFoodItem } from '@/models';

global.fetch = vi.fn();

describe('useFdcData', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('searchFdcData', () => {
    const { searchFdcData } = useFdcData();

    it('makes a GET request to USDA FDC API with correct parameters', async () => {
      const mockResponse = {
        foods: [
          { fdcId: 123, description: 'Apple, raw' },
          { fdcId: 456, description: 'Apple juice' },
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
      const mockResponse = {
        foods: [
          { fdcId: 123, description: 'Apple, raw' },
          { fdcId: 456, description: 'Apple juice' },
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
      const mockResponse = { foods: [] };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchFdcData('chicken & rice');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.nal.usda.gov/fdc/v1/foods/search?query=chicken%20%26%20rice&dataType=Foundation&pageSize=25&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=lH3yRDraY43gGXZUbP6bGbdidhAHNetvtPvZNDum',
      );
    });

    it('returns mapped food items with fdcId and description', async () => {
      const mockResponse = {
        foods: [
          {
            fdcId: 123,
            description: 'Apple, raw',
            brandOwner: 'Generic',
            dataType: 'Foundation',
            servingSize: 100,
            nutrients: [],
          },
          {
            fdcId: 456,
            description: 'Apple juice',
            brandOwner: 'Brand X',
            dataType: 'Branded',
            servingSize: 240,
            nutrients: [],
          },
        ],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchFdcData('apple');

      expect(result).toEqual([
        { fdcId: 123, description: 'Apple, raw' },
        { fdcId: 456, description: 'Apple juice' },
      ]);
    });

    it('returns an empty array when no foods found', async () => {
      const mockResponse = { foods: [] };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchFdcData('nonexistentfood');

      expect(result).toEqual([]);
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

    it('handles network errors', async () => {
      (fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(searchFdcData('apple')).rejects.toThrow('Network error');
    });

    it('should handle malformed API response gracefully', async () => {
      const mockResponse = { foods: null };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await expect(searchFdcData('apple')).rejects.toThrow();
    });

    it('handles foods with missing properties', async () => {
      const mockResponse = {
        foods: [
          { fdcId: 123, description: 'Complete item' },
          { fdcId: 456 },
          { description: 'Missing fdcId' },
          { fdcId: 789, description: null },
        ],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchFdcData('apple');

      expect(result).toEqual([
        { fdcId: 123, description: 'Complete item' },
        { fdcId: 456, description: undefined },
        { fdcId: undefined, description: 'Missing fdcId' },
        { fdcId: 789, description: null },
      ]);
    });

    it('handles empty query string', async () => {
      const mockResponse = { foods: [] };

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
    const { fetchFoodItem } = useFdcData();

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

      const { item, portions } = await fetchFoodItem(748967);

      expect(item).toEqual({
        fdcId: 748967,
        name: 'Eggs, Grade A, Large, egg whole',
        category: 'Dairy',
        servingSize: 100,
        unitOfMeasure: { id: 'g', name: 'Gram', type: 'weight', system: 'metric' },
        grams: 100,
        calories: 148,
        protein: 12.4,
        fat: 9.96,
        carbs: 0.96,
        sugar: 0.2,
        sodium: 129,
      });

      expect(portions).toEqual(TEST_FDC_FOOD_ITEM.foodPortions);
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
