<template>
  <h1 class="text-center">Sources for Recipes</h1>

  <v-progress-circular v-if="loading" indeterminate />

  <h2 v-else-if="sources.length === 0">No sources found</h2>

  <v-list v-else>
    <v-list-item v-for="source in sources" :key="source.id" @click="router.push(`/sources/${source.id}/update`)"
      >{{ source.name }}
      <template v-if="source.id !== 'restaurant'" #append>
        <v-icon icon="mdi-close" @click.stop="console.log('append item clicked')" />
      </template>
    </v-list-item>
  </v-list>

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
import { useSourcesData } from '@/data/sources';
import { useRouter } from 'vue-router';

const { loading, sources } = useSourcesData();
const router = useRouter();
</script>
