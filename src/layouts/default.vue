<template>
  <DefaultMobileLayout :menuItems="menuItems" @logout="performLogout" v-if="$vuetify.display.mobile" />
  <DefaultDesktopLayout :menuItems="menuItems" @logout="performLogout" v-else />
</template>

<script lang="ts" setup>
import { useAuthentication } from '@/core/authentication';
import DefaultDesktopLayout from './components/DefaultDesktopLayout.vue';
import DefaultMobileLayout from './components/DefaultMobileLayout.vue';
import { useRouter } from 'vue-router';

const menuItems = [
  { icon: 'mdi-view-dashboard-outline', title: 'Dashboard', value: 'dashboard', path: '/dashboard' },
  { icon: 'mdi-clipboard-list-outline', title: 'Planning', value: 'planning', path: '/planning' },
  { icon: 'mdi-format-list-checkbox', title: 'Shopping', value: 'shopping', path: '/shopping' },
  { icon: 'mdi-food-apple-outline', title: 'Foods', value: 'foods', path: '/foods' },
  { icon: 'mdi-pasta', title: 'Recipes', value: 'recipes', path: '/recipes' },
];

const router = useRouter();
const { logout } = useAuthentication();

const performLogout = async () => {
  await logout();
  router.replace('/login');
};
</script>

<style scoped>
.full {
  height: 100vh;
}
</style>
