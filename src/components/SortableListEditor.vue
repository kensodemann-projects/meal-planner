<template>
  <div>
    <h2>
      <div class="d-flex justify-space-between">
        <div>{{ title }}</div>
        <v-btn
          density="compact"
          variant="text"
          icon="mdi-plus"
          :disabled="hasInvalidItems"
          @click="addItem"
          :data-testid="`add-${testIdPrefix}-button`"
        ></v-btn>
      </div>
    </h2>
    <v-divider class="mb-4"></v-divider>

    <draggable
      v-model="internalList"
      :class="listClass"
      :data-testid="`${testIdPrefix}-list`"
      item-key="id"
      :disabled="!sortable"
      handle=".drag-handle"
      @end="handleDragEnd"
    >
      <template #item="{ element, index }">
        <div class="list-item-wrapper">
          <v-icon v-if="sortable" class="drag-handle" icon="mdi-drag-vertical" size="small"></v-icon>
          <div class="list-item-content">
            <slot
              name="item"
              :item="element"
              :index="index"
              :on-change="(updatedItem: T) => changeItem(updatedItem, index)"
              :on-delete="() => deleteItem(index)"
            ></slot>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: string }">
import { computed } from 'vue';
import draggable from 'vuedraggable';

const props = withDefaults(
  defineProps<{
    modelValue: T[];
    title: string;
    validateItem: (item: T) => boolean;
    createItem: () => T;
    sortable?: boolean;
    testIdPrefix?: string;
    listClass?: string;
  }>(),
  {
    sortable: true,
    testIdPrefix: 'item',
    listClass: 'editable-list',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: T[]];
  'list-modified': [];
}>();

const internalList = computed({
  get: () => props.modelValue,
  set: (value: T[]) => {
    emit('update:modelValue', value);
    emit('list-modified');
  },
});

const hasInvalidItems = computed(() => {
  return props.modelValue.some((item) => !props.validateItem(item));
});

const addItem = () => {
  const newItem = props.createItem();
  internalList.value = [...props.modelValue, newItem];
};

const changeItem = (updatedItem: T, index: number) => {
  const updated = [...props.modelValue];
  updated[index] = updatedItem;
  internalList.value = updated;
};

const deleteItem = (index: number) => {
  const updated = [...props.modelValue];
  updated.splice(index, 1);
  internalList.value = updated;
};

const handleDragEnd = () => {
  emit('list-modified');
};
</script>

<style scoped>
.editable-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px;
}

.list-item-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 16px;
}

.drag-handle {
  cursor: grab;
  opacity: 0.4;
  flex-shrink: 0;
}

.drag-handle:hover {
  opacity: 0.8;
}

.drag-handle:active {
  cursor: grabbing;
}

.list-item-content {
  flex: 1;
  min-width: 0;
}
</style>
