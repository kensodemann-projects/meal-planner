<template>
  <v-row dense>
    <v-col cols="6" md="1">
      <v-number-input density="compact" hide-details control-variant="hidden"></v-number-input>
    </v-col>
    <v-col cols="6" md="2">
      <v-autocomplete
        density="compact"
        hide-details
        :items="unitsOfMeasure"
        item-title="id"
        item-value="id"
      ></v-autocomplete>
    </v-col>
    <v-col cols="11" md="8">
      <v-combobox density="compact" label="Food Item" item-title="name" hide-details :items="foods"></v-combobox>
    </v-col>
    <v-col cols="1" md="1" align-self="center">
      <v-btn density="compact" variant="plain" icon="mdi-delete-forever"></v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { unitsOfMeasure } from '@/data/units-of-measure';
import type { FoodItem } from '@/models/food';

defineProps<{
  foods: FoodItem[];
}>();
</script>
