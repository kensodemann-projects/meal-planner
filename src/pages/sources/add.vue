<template>
  <SourceEditor @cancel="router.replace('/sources')" @save="saveSource" />
</template>

<script setup lang="ts">
import { useSourcesData } from '@/data/sources';
import type { Source } from '@/models/source';
import { useRouter } from 'vue-router';

const router = useRouter();
const { addSource } = useSourcesData();

const saveSource = async (source: Source) => {
  await addSource(source);
  router.replace('/sources');
};
</script>
