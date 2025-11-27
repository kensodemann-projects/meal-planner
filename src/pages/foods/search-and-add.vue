<template>
  <div class="search-page">
    <div class="d-flex justify-center mb-5">
      <div class="search-container">
        <SearchInput
          label="Search for food"
          placeholder="Search for a food to add..."
          :isSearching="isSearching"
          @search="performSearch"
        />
        <div class="mt-2 pr-4 text-right">
          <CancelButton @click="router.replace('/foods')" />
        </div>
      </div>
    </div>

    <div v-if="!!searchResults?.totalHits" class="search-results w-100 mt-8" data-testid="results-container">
      <h2 class="text-h5 mb-4">Search Results ({{ searchResults.totalHits }} items found)</h2>

      <v-container v-if="isChangingPage" class="text-center mt-8">
        Getting more foods...
        <v-progress-linear class="mt-4" color="primary" height="6" indeterminate rounded></v-progress-linear>
      </v-container>

      <v-list v-else class="search-results-list">
        <FdcFoodListItem
          v-for="food in searchResults.foods"
          :key="food.fdcId"
          :food="food"
          @add="addFoodItem"
          :adding="isAddingFood"
        />
      </v-list>

      <v-container class="max-width">
        <v-pagination v-model="page" :length="searchResults.totalPages" class="my-4"></v-pagination>
      </v-container>
    </div>

    <div v-else-if="hasSearched && !isSearching" class="d-flex justify-center mt-8" data-testid="no-results">
      <v-alert type="info" class="text-center"> No food items found. </v-alert>
    </div>

    <v-snackbar v-model="showMessage" :color="messageColor" :timeout="2000">
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { useFoodsData } from '@/data/foods';
import { fetchFoodItem, searchFdcData } from '@/data/usda-fdc-data';
import type { FdcFoodSearchFoodItem, FdcFoodSearchResult } from '@/models/usda-fdc';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const searchResults = ref<FdcFoodSearchResult>();
const isAddingFood = ref(false);
const isChangingPage = ref(false);
const isSearching = ref(false);
const hasSearched = ref(false);
const showMessage = ref(false);
const message = ref('');
const messageColor = ref('success');
const page = ref(1);

const { addFood, fdcFoodItemExists } = useFoodsData();
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

const displayError = (msg: string) => {
  message.value = msg;
  messageColor.value = 'error';
  showMessage.value = true;
};

const displaySuccess = (msg: string) => {
  message.value = msg;
  messageColor.value = 'success';
  showMessage.value = true;
};

const addFoodItem = async (foodItem: FdcFoodSearchFoodItem) => {
  if (fdcFoodItemExists(foodItem.fdcId)) {
    displayError('This food item already exists.');
  } else {
    try {
      isAddingFood.value = true;
      const food = await fetchFoodItem(foodItem.fdcId);
      await addFood(food);
      isAddingFood.value = false;
      displaySuccess('The food item has been added to your food list.');
    } catch {
      displayError('Failed to add food item. Please try again.');
    }
  }
};
</script>

<style scoped>
.search-container {
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
