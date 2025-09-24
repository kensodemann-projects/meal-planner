<template>
  <DefaultMobileLayout :menuItems="menuItems" v-if="$vuetify.display.mobile" />
  <DefaultDesktopLayout :menuItems="menuItems" v-else />
</template>

<script lang="ts" setup>
import DefaultDesktopLayout from './components/DefaultDesktopLayout.vue';
import DefaultMobileLayout from './components/DefaultMobileLayout.vue';

const menuItems = [
  { icon: 'mdi-view-dashboard-outline', title: 'Dashboard', value: 'dashboard', path: '/dashboard' },
  { icon: 'mdi-clipboard-list-outline', title: 'Planning', value: 'planning', path: '/planning' },
  { icon: 'mdi-format-list-checkbox', title: 'Shopping', value: 'shopping', path: '/shopping' },
  { icon: 'mdi-food-outline', title: 'Recipes', value: 'recipes', path: '/recipes' },
];
</script>

<style scoped>
.full {
  height: 100vh;
}
</style>
