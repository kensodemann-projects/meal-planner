// Note: The USDA FDC API returns objects with a lot potential properties. These definitions only
//       cover data points that are likely to be used.

export interface FdcFoodSearchFoodItem {
  fdcId: number;
  description: string;
  foodCategory: string;
}

export interface FdcFoodSearchResult {
  currentPage: number;
  totalPages: number;
  totalHits: number;
  foodSearchCriteria: {
    query: string;
  };
  foods: FdcFoodSearchFoodItem[];
}

export interface FdcFoodCategory {
  id: number;
  code: string;
  description: string;
}

export interface FdcFoodPortion {
  gramWeight: number;
  amount: number;
  measureUnit: { id: number; name: string; abbreviation: string };
}

export interface FdcFoodNutrient {
  nutrient: { id: number; number: string; name: string; rank: number; unitName: string };
  amount: number;
}

export interface FdcFoodItem {
  fdcId: number;
  description: string;
  foodCategory: FdcFoodCategory;
  foodNutrients: FdcFoodNutrient[];
  foodPortions: FdcFoodPortion[];
}
