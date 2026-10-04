<template>
  <h1 class="text-center">Sources for Recipes</h1>

  <v-progress-circular v-if="loading" indeterminate />

  <h2 v-else-if="sources.length === 0">No sources found</h2>

  <v-list v-else>
    <v-list-item v-for="source in sources" :key="source.id" @click="router.push(`/sources/${source.id}/update`)"
      >{{ source.name }}
      <template v-if="source.id !== GENERIC_RESTAURANT_SOURCE_ID" #append>
        <v-icon icon="mdi-close" @click.stop="confirmRemove(source)" />
      </template>
    </v-list-item>
  </v-list>

  <v-dialog v-model="showConfirmDialog" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      :question="`Are you sure you want to delete ${selectedSource?.name}?`"
      icon-color="error"
      @confirm="doRemove"
      @cancel="showConfirmDialog = false"
    />
  </v-dialog>

  <v-fab
    color="primary"
    icon="mdi-plus"
    variant="tonal"
    location="bottom end"
    absolute
    @click="router.push('/sources/add')"
    data-testid="add-button"
  ></v-fab>
</template>

<script setup lang="ts">
import { GENERIC_RESTAURANT_SOURCE_ID, useSourcesData } from '@/data/sources';
import type { Source } from '@/models/source';
import { ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';

const { loading, sources, removeSource } = useSourcesData();
const router = useRouter();
const showConfirmDialog = shallowRef(false);
const selectedSource = ref<Source | null>(null);

const confirmRemove = (source: Source) => {
  selectedSource.value = source;
  showConfirmDialog.value = true;
};

const doRemove = () => {
  removeSource(selectedSource.value!.id!);
  showConfirmDialog.value = false;
};
</script>
