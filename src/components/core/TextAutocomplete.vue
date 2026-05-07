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
  rules?: ((value: any) => boolean | string)[];
}>();
const modelValue = defineModel<string | null>();

const search = ref('');

const selectFirstItem = () => {
  modelValue.value = search.value
    ? props.items.find((item) => item.toLowerCase().includes(search.value.toLowerCase())) || null
    : null;
};
</script>
