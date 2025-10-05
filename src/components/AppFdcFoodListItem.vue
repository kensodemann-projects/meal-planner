<template>
  <div class="app-fdc-food-list-item">
    <v-list-item>
      <v-list-item-title>{{ food.description }}</v-list-item-title>
      <v-list-item-subtitle>{{ food.foodCategory }}</v-list-item-subtitle>

      <template #append>
        <v-btn color="success" variant="outlined" size="small" @click="$emit('add', food)"> Add Item </v-btn>
      </template>
    </v-list-item>
    <v-divider></v-divider>
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

<style scoped>
.v-list-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.2);
}
</style>
