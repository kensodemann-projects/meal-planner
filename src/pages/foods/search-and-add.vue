<template>
  <div class="search-page d-flex flex-column h-100">
    <div class="search-container d-flex justify-center mb-5">
      <app-search-input
        label="Search for food"
        placeholder="Search for a food to add..."
        :isSearching="isSearching"
        @search="performSearch"
      />
    </div>

    <div
      v-if="!!searchResults?.totalHits"
      class="d-flex overflow-y-auto flex-column h-100 w-100 mt-8"
      data-testid="results-container"
    >
      <h2 class="text-h5 mb-4 flex-grow-0">Search Results ({{ searchResults.totalHits }} items found)</h2>

      <v-container v-if="changingPage" class="text-center flex-grow-1 mt-8">
        Getting more foods...
        <v-progress-linear class="mt-4" color="primary" height="6" indeterminate rounded></v-progress-linear>
      </v-container>

      <v-list v-else class="search-results-list flex-grow-1">
        <app-fdc-food-list-item v-for="food in searchResults.foods" :key="food.fdcId" :food="food" @add="addFoodItem" />
      </v-list>

      <v-container class="max-width">
        <v-pagination v-model="page" :length="searchResults.totalPages" class="my-4"></v-pagination>
      </v-container>
    </div>

    <div v-else-if="hasSearched && !isSearching" class="d-flex justify-center mt-8" data-testid="no-results">
      <v-alert type="info" class="text-center"> No food items found. </v-alert>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchFoodItem, searchFdcData } from '@/core/usda-fdc-data';
import type { FdcFoodSearchFoodItem, FdcFoodSearchResult } from '@/models';
import { ref, watch } from 'vue';

const searchResults = ref<FdcFoodSearchResult>();
const changingPage = ref(false);
const isSearching = ref(false);
const hasSearched = ref(false);
const page = ref(1);

const performSearch = async (query: string): Promise<void> => {
  searchResults.value = undefined;
  hasSearched.value = true;
  isSearching.value = true;
  page.value = 1;
  searchResults.value = await searchFdcData(query);
  isSearching.value = false;
};

watch(page, async (newPage, oldPage) => {
  if (newPage !== oldPage && !isSearching.value) {
    changingPage.value = true;
    searchResults.value = await searchFdcData(searchResults.value?.foodSearchCriteria.query || '', newPage);
    changingPage.value = false;
  }
});

const addFoodItem = async (foodItem: FdcFoodSearchFoodItem) => {
  await fetchFoodItem(foodItem.fdcId);
};
</script>

<style scoped>
.search-page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem;
}

.app-search-input {
  max-width: 600px;
  width: 100%;
}

.search-results-list {
  background: transparent;
}

/* Responsive design */
@media (max-width: 600px) {
  .search-page {
    padding: 1rem;
  }
}
</style>
