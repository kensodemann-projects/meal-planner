<template>
  <SourceEditor @cancel="$router.push('/sources')" @save="saveSource" />
</template>

<script setup lang="ts">
import type { Source } from '@/models/source';

const saveSource = (source: Source) => {
  console.log(source);
};
</script>
