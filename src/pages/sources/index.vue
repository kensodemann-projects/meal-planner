<template>
  <v-list>
    <v-list-item
      v-for="source in sources"
      :key="source.id"
      append-icon="mdi-close"
      @click="console.log('main item clicked')"
      >{{ source.name }}
      <template #append>
        <v-icon icon="mdi-close" @click.stop="console.log('append item clicked')" />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const sources = [
  {
    name: 'Item #1',
    id: 1,
  },
  {
    name: 'Item #2',
    id: 2,
  },
  {
    name: 'Item #3',
    id: 3,
  },
];
</script>
