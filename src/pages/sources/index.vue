<template>
  <v-list>
    <v-list-item v-for="source in sources" :key="source.id" @click="console.log('main item clicked')"
      >{{ source.name }}
      <template v-if="source.id !== 'restaurant'" #append>
        <v-icon icon="mdi-close" @click.stop="console.log('append item clicked')" />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const sources = [
  {
    name: 'Generic Restaurant',
    id: 'restaurant',
  },
  {
    name: 'Item #1',
    id: '1004399v09asdfkfe',
  },
  {
    name: 'Item #2',
    id: '1004399v09asdfkfe2',
  },
  {
    name: 'Item #3',
    id: '1004399v09asdfkfe3',
  },
];
</script>
