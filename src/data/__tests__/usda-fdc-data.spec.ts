import type { FdcFoodSearchResult } from '@/models/usda-fdc';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { searchFdcData } from '../usda-fdc-data';

global.fetch = vi.fn();

const TEST_API_KEY = '469327b2-8ec3-4bfb-93f8-60790dc53fae';

describe('USDA FDC Data', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('VITE_USDA_FDC_API_KEY', TEST_API_KEY);
  });

  describe('searchFdcData', () => {
    it('makes a GET request to USDA FDC API with correct parameters', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 1,
        currentPage: 1,
        totalHits: 2,
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
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&dataType=Foundation&pageSize=25&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=${TEST_API_KEY}`,
      );
    });

    it('sets the page number if passed', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 1,
        currentPage: 1,
        totalHits: 2,
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
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=apple&dataType=Foundation&pageSize=25&pageNumber=2&sortBy=dataType.keyword&sortOrder=asc&api_key=${TEST_API_KEY}`,
      );
    });

    it('properly encodes special characters in query', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 0,
        currentPage: 0,
        totalHits: 0,
        foodSearchCriteria: { query: 'chicken & rice' },
        foods: [],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchFdcData('chicken & rice');

      expect(fetch).toHaveBeenCalledWith(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=chicken%20%26%20rice&dataType=Foundation&pageSize=25&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=${TEST_API_KEY}`,
      );
    });

    it('returns the JSON from the response', async () => {
      const mockResponse: FdcFoodSearchResult = {
        totalPages: 1,
        currentPage: 1,
        totalHits: 2,
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
        totalHits: 2,
        foodSearchCriteria: { query: '' },
        foods: [],
      };

      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await searchFdcData('');

      expect(fetch).toHaveBeenCalledWith(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=&dataType=Foundation&pageSize=25&pageNumber=1&sortBy=dataType.keyword&sortOrder=asc&api_key=${TEST_API_KEY}`,
      );
    });
  });
});
