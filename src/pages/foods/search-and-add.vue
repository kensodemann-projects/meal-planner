<template>
  <div class="search-page d-flex flex-column">
    <div class="search-container d-flex justify-center mb-5">
      <SearchInput
        label="Search for food"
        placeholder="Search for a food to add..."
        :isSearching="isSearching"
        @search="performSearch"
      />
    </div>

    <div
      v-if="!!searchResults?.totalHits"
      class="search-results d-flex overflow-y-auto flex-column w-100 mt-8"
      data-testid="results-container"
    >
      <h2 class="text-h5 mb-4 flex-grow-0">Search Results ({{ searchResults.totalHits }} items found)</h2>

      <v-container v-if="isChangingPage || isCreatingFood" class="text-center flex-grow-1 mt-8">
        {{ isChangingPage ? 'Getting more foods...' : 'Creating selected food item...' }}
        <v-progress-linear class="mt-4" color="primary" height="6" indeterminate rounded></v-progress-linear>
      </v-container>

      <v-list v-else class="search-results-list flex-grow-1">
        <FdcFoodListItem v-for="food in searchResults.foods" :key="food.fdcId" :food="food" @add="addFoodItem" />
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
import { useFoodsData } from '@/data/foods';
import { fetchFoodItem, searchFdcData } from '@/data/usda-fdc-data';
import type { FdcFoodSearchFoodItem, FdcFoodSearchResult } from '@/models';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const searchResults = ref<FdcFoodSearchResult>();
const isChangingPage = ref(false);
const isCreatingFood = ref(false);
const isSearching = ref(false);
const hasSearched = ref(false);
const page = ref(1);

const { addFood } = useFoodsData();
const router = useRouter();

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
    isChangingPage.value = true;
    searchResults.value = await searchFdcData(searchResults.value?.foodSearchCriteria.query || '', newPage);
    isChangingPage.value = false;
  }
});

const addFoodItem = async (foodItem: FdcFoodSearchFoodItem) => {
  isCreatingFood.value = true;
  const food = await fetchFoodItem(foodItem.fdcId);
  const id = await addFood(food);
  isCreatingFood.value = false;
  router.push(`/foods/${id}`);
};
</script>

<style scoped>
.search-input {
  max-width: 600px;
  width: 100%;
}

.search-page {
  height: 90vh;
}

@media (min-width: 1280px) {
  .search-page {
    height: 95vh;
  }
}
</style>
