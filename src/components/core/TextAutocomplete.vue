<template>
  <v-autocomplete
    v-bind="$attrs"
    :label="label"
    v-model="modelValue"
    v-model:search="search"
    :items="items"
    :rules="rules"
    @keydown.tab="selectFirstItem"
  ></v-autocomplete>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  label: string;
  items: string[];
  rules: ((value: any) => boolean | string)[];
}>();
const modelValue = defineModel<string>('');

const search = ref('');

const selectFirstItem = () => {
  if (search.value && props.items.length > 0) {
    modelValue.value = props.items[0];
  }
};
</script>
