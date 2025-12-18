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
      :data-testid="`${testIdPrefix}-grid`"
      item-key="id"
      :disabled="!sortable"
      handle=".drag-handle"
      @end="handleDragEnd"
    >
      <template #item="{ element, index }">
        <div class="list-item-wrapper">
          <v-icon
            v-if="sortable"
            class="drag-handle"
            icon="mdi-drag-vertical"
            size="small"
            role="button"
            tabindex="0"
            aria-label="Drag to reorder, or use Alt+Arrow keys to move"
            @keydown="(e: KeyboardEvent) => handleKeydown(e, index)"
          ></v-icon>
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

const handleKeydown = (event: KeyboardEvent, index: number) => {
  // Alt+ArrowUp moves item up, Alt+ArrowDown moves item down
  if (event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault();

    const newIndex = event.key === 'ArrowUp' ? index - 1 : index + 1;

    // Check bounds
    if (newIndex < 0 || newIndex >= props.modelValue.length) {
      return;
    }

    // Swap items - TypeScript doesn't know these indices are valid, but we checked above
    const updated = [...props.modelValue];
    const temp = updated[index]!;
    updated[index] = updated[newIndex]!;
    updated[newIndex] = temp;
    internalList.value = updated;

    // Focus the drag handle at the new position after a short delay
    setTimeout(() => {
      const dragHandles = document.querySelectorAll('.drag-handle');
      const targetHandle = dragHandles[newIndex] as HTMLElement;
      if (targetHandle) {
        targetHandle.focus();
      }
    }, 50);
  }
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
  border-radius: 4px;
}

.drag-handle:hover {
  opacity: 0.8;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle:focus {
  opacity: 1;
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.list-item-content {
  flex: 1;
  min-width: 0;
}
</style>
