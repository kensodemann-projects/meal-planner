<template>
  <div class="text-center">
    <h1>{{ packageInfo.description }} - v{{ packageInfo.version }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useSettingsData } from '@/data/settings';
import packageInfo from '../../package.json';

useSettingsData();
</script>
