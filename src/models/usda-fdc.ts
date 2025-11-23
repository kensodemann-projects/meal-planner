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
