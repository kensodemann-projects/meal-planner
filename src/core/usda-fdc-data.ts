import type { FdcFoodSearchResult, FoodItem } from '@/models';
import { fromFdcToFoodItem } from './converters';

const API_URL = 'https://api.nal.usda.gov/fdc/v1';

export const searchFdcData = async (query: string, page?: number): Promise<FdcFoodSearchResult> => {
  const response = await fetch(
    `${API_URL}/foods/search?query=${encodeURIComponent(query)}&dataType=Foundation&pageSize=25&pageNumber=${page || 1}&sortBy=dataType.keyword&sortOrder=asc&api_key=${import.meta.env.VITE_USDA_FDC_API_KEY}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch USDA FDC data');
  }
  return await response.json();
};

export const fetchFoodItem = async (fdcId: number): Promise<FoodItem> => {
  const response = await fetch(
    `${API_URL}/food/${fdcId}?api_key=${import.meta.env.VITE_USDA_FDC_API_KEY}&nutrients=203&nutrients=204&nutrients=205&nutrients=208&nutrients=269.3&nutrients=307`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch USDA FDC data');
  }
  return fromFdcToFoodItem(await response.json());
};
