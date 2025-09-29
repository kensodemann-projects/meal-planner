<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
router.replace('/dashboard');
</script>

<route lang="yaml">
meta:
  layout: standalone
</route>
