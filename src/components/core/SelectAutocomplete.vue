<template>
  <v-autocomplete
    v-bind="$attrs"
    :label="label"
    v-model="autocompleteModel"
    v-model:search="search"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :rules="rules"
    @keydown.tab="selectFirstItem"
  ></v-autocomplete>
</template>

<script setup lang="ts" generic="T, TValue = T">
import { computed, ref } from 'vue';

const props = defineProps<{
  label: string;
  items: T[];
  itemTitle?: string;
  itemValue?: string;
  rules?: ((value: any) => boolean | string)[];
}>();
const modelValue = defineModel<TValue | null | undefined>();

const search = ref('');

const getProperty = (item: T, property: string, fallback: unknown): unknown => {
  if (item !== Object(item)) return fallback;
  const value = (item as Record<string, unknown>)[property];
  return value === undefined ? fallback : value;
};

// Match Vuetify's defaults so specifying only item-title or only item-value behaves the same as VAutocomplete.
const getTitle = (item: T): string => String(getProperty(item, props.itemTitle ?? 'title', item));

const getValue = (item: T): TValue => getProperty(item, props.itemValue ?? 'value', getTitle(item)) as TValue;

// VAutocomplete types v-model from the item type; TValue is the selected item-value.
const autocompleteModel = computed({
  get: () => modelValue.value as any,
  set: (value: any) => {
    modelValue.value = value;
  },
});

const selectFirstItem = () => {
  if (!search.value) {
    modelValue.value = null;
    return;
  }
  const query = search.value.toLowerCase();
  const match = props.items.find((item) => getTitle(item).toLowerCase().includes(query));
  if (match === undefined) {
    modelValue.value = null;
    return;
  }
  modelValue.value = getValue(match);
  search.value = getTitle(match);
};
</script>
