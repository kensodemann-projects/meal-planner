<template>
  <div class="fdc-food-list-item">
    <v-list-item>
      <v-list-item-title>{{ food.description }}</v-list-item-title>
      <v-list-item-subtitle>{{ food.foodCategory }}</v-list-item-subtitle>

      <template #append>
        <v-btn color="primary" variant="outlined" size="small" @click="$emit('add', food)"> Add Item </v-btn>
      </template>
    </v-list-item>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  food: {
    description: string;
    fdcId: number;
    foodCategory: string;
  };
}>();

defineEmits(['add']);
</script>
