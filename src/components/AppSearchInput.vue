<template>
  <div class="app-search-input">
    <v-text-field
      v-model="searchText"
      :label="label"
      :placeholder="placeholder"
      variant="outlined"
      @keyup.enter="performSearch"
      :loading="isSearching"
      clearable
    >
      <template #append-inner>
        <v-btn
          color="primary"
          @click="performSearch"
          :disabled="!searchText?.trim() || isSearching"
          :loading="isSearching"
          class="search-button"
        >
          {{ buttonLabel }}
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  label: { type: String, default: 'Search' },
  placeholder: { type: String, default: 'Search...' },
  buttonLabel: { type: String, default: 'Search' },
  isSearching: { type: Boolean, default: false },
});

const emits = defineEmits(['search']);

const searchText = ref('');

function performSearch() {
  emits('search', searchText.value.trim());
}
</script>

<style scoped>
.search-button {
  margin-left: 1rem;
}
</style>
