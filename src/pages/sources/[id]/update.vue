<template>
  <SourceEditor v-if="source" :source="source" @cancel="router.replace('/sources')" @save="saveSource" />
</template>

<script setup lang="ts">
import { useSourcesData } from '@/data/sources';
import type { Source } from '@/models/source';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const { params } = useRoute();
const id = (params as { id: string }).id;
const source = ref<Source | null>();

const { getSource, updateSource } = useSourcesData();
getSource(id)
  .then((item) => (source.value = item))
  .catch(() => {
    // Error handling for UI feedback is a future task
    source.value = null;
  });

const saveSource = async (item: Source) => {
  if (!id) {
    router.replace('/sources');
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _ignored, ...fields } = item;
  await updateSource(id, fields);
  router.replace('/sources');
};
</script>
