<template>
  <h1 class="text-center">Sources for Recipes</h1>

  <v-progress-circular v-if="loading" indeterminate />

  <h2 v-else-if="sources.length === 0">No sources found</h2>

  <v-list v-else>
    <v-list-item v-for="source in sources" :key="source.id" @click="console.log('main item clicked')"
      >{{ source.name }}
      <template v-if="source.id !== 'restaurant'" #append>
        <v-icon icon="mdi-close" @click.stop="console.log('append item clicked')" />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useSourcesData } from '@/data/sources';

const { loading, sources } = useSourcesData();
</script>
