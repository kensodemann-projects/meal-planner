<template>
  <div class="ingredient-editor-row">
    <div class="ingredient-editor-row__units">
      <v-number-input
        density="compact"
        hide-details
        control-variant="hidden"
        :precision="null"
        :rules="[validationRules.required]"
        v-model="units"
        data-testid="units-input"
        ref="unitsInput"
      ></v-number-input>
    </div>
    <div class="ingredient-editor-row__unit-of-measure">
      <v-autocomplete
        ref="uomAutocomplete"
        density="compact"
        hide-details
        :items="unitsOfMeasure"
        :rules="[validationRules.required]"
        item-title="name"
        item-value="id"
        v-model="unitOfMeasureId"
        v-model:search="uomSearch"
        data-testid="unit-of-measure-input"
        @keydown.tab="onUomTab"
      ></v-autocomplete>
    </div>
    <div class="ingredient-editor-row__name">
      <v-text-field
        density="compact"
        label="Ingredient"
        hide-details
        :rules="[validationRules.required]"
        v-model="ingredientName"
        data-testid="ingredient-name-input"
        @keydown.ctrl.enter="$emit('add-next')"
      ></v-text-field>
    </div>
    <div class="ingredient-editor-row__delete">
      <v-btn
        density="compact"
        variant="plain"
        icon="mdi-delete-forever"
        @click="showConfirmDelete = true"
        data-testid="delete-button"
      ></v-btn>
    </div>
  </div>
  <v-dialog v-model="showConfirmDelete" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      question="Are you sure you want to delete this ingredient?"
      icon-color="error"
      @confirm="
        () => {
          showConfirmDelete = false;
          emit('delete');
        }
      "
      @cancel="() => (showConfirmDelete = false)"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { findUnitOfMeasure } from '@/core/find-unit-of-measure';
import { validationRules } from '@/core/validation-rules';
import { unitsOfMeasure } from '@/data/units-of-measure';
import type { RecipeIngredient } from '@/models/recipe';
import type { UnitOfMeasure } from '@/models/unit-of-measure';
import { computed, nextTick, onMounted, shallowRef, watch } from 'vue';
import type { VAutocomplete, VNumberInput } from 'vuetify/components';

const props = defineProps<{
  ingredient: Partial<RecipeIngredient>;
}>();
const emit = defineEmits<{
  (event: 'changed', payload: Partial<RecipeIngredient>): void;
  (event: 'add-next'): void;
  (event: 'delete'): void;
}>();

const showConfirmDelete = shallowRef(false);
const unitsInput = shallowRef<VNumberInput | null>(null);
const uomAutocomplete = shallowRef<InstanceType<typeof VAutocomplete> | null>(null);
const uomSearch = shallowRef('');
const uomInlineSuggestion = shallowRef<UnitOfMeasure | null>(null);

function findUomSuggestion(search: string): UnitOfMeasure | null {
  const lowerSearch = search.toLowerCase();
  const normalizedSearch = lowerSearch.replace(/\s+/g, '').replace(/-/g, '');
  return (
    unitsOfMeasure.find(
      (u) =>
        u.name.toLowerCase().startsWith(lowerSearch) ||
        u.id.toLowerCase() === normalizedSearch ||
        u.name.toLowerCase().replace(/\s+/g, '') === normalizedSearch,
    ) ?? null
  );
}

watch(uomSearch, (search) => {
  if (!search) {
    uomInlineSuggestion.value = null;
    return;
  }
  const lowerSearch = search.toLowerCase();
  // Skip if the search is already the full suggestion name (set programmatically above)
  if (uomInlineSuggestion.value && lowerSearch === uomInlineSuggestion.value.name.toLowerCase()) {
    return;
  }
  const match = findUomSuggestion(search);
  if (match && match.name.toLowerCase() !== lowerSearch) {
    uomInlineSuggestion.value = match;
    const originalLength = search.length;
    uomSearch.value = match.name;
    nextTick(() => {
      const input = uomAutocomplete.value?.$el?.querySelector('input') as HTMLInputElement | null;
      if (input) {
        input.setSelectionRange(originalLength, match.name.length);
      }
    });
  } else {
    uomInlineSuggestion.value = null;
  }
});

function onUomTab() {
  if (!uomInlineSuggestion.value) return;
  const unitOfMeasure = uomInlineSuggestion.value;
  emit('changed', { ...props.ingredient, unitOfMeasure });
  uomInlineSuggestion.value = null;
}

const units = computed({
  get: () => props.ingredient.units,
  set: (units: number) =>
    emit('changed', {
      ...props.ingredient,
      units,
    }),
});

const unitOfMeasureId = computed({
  get: () => props.ingredient.unitOfMeasure?.id,
  set: (id: string | null) => {
    if (id == null) return;
    const unitOfMeasure = findUnitOfMeasure(id);
    emit('changed', {
      ...props.ingredient,
      unitOfMeasure,
    });
  },
});

const ingredientName = computed({
  get: () => props.ingredient.name,
  set: (name: string) => {
    emit('changed', {
      ...props.ingredient,
      name,
    });
  },
});

onMounted(() => unitsInput.value?.focus());
</script>

<style scoped>
.ingredient-editor-row {
  --gap: 12px;
  --mobile-gap-offset: calc(var(--gap) / 2);
  --desktop-gap-offset: calc(var(--gap) * 3 / 4);

  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  align-items: center;
}

.ingredient-editor-row__units {
  flex: 0 0 calc(50% - var(--mobile-gap-offset));
}

.ingredient-editor-row__unit-of-measure {
  flex: 0 0 calc(50% - var(--mobile-gap-offset));
}

.ingredient-editor-row__name {
  flex: 1 1 auto;
}

.ingredient-editor-row__delete {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (min-width: 960px) {
  .ingredient-editor-row {
    flex-wrap: nowrap;
  }

  .ingredient-editor-row__units {
    flex: 0 0 calc(8.333% - var(--desktop-gap-offset));
  }

  .ingredient-editor-row__unit-of-measure {
    flex: 0 0 calc(16.667% - var(--desktop-gap-offset));
  }
}
</style>
