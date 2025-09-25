<template>
  <v-layout>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Meal Planner</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          :to="{ path: item.path }"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item prepend-icon="mdi-cog-outline" title="Settings" value="settings" to="/settings"></v-list-item>
        <v-list-item prepend-icon="mdi-logout" title="Logout" value="logout" to="/login"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="full">
      <router-view />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { MenuItem } from './menu-item';

defineProps<{ menuItems: MenuItem[] }>();
const drawer = ref(false);
</script>

<style scoped>
.full {
  height: 100vh;
}
</style>
