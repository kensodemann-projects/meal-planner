<template>
  <v-form v-model="valid">
    <h2>Basic Information</h2>
    <v-divider class="mb-4"></v-divider>

    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="Name"
            placeholder="Enter the name of the food..."
            v-model="name"
            :rules="[validationRules.required]"
            data-testid="name-input"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="Brand"
            placeholder="Enter the brand (optional)..."
            v-model="brand"
            data-testid="brand-input"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-autocomplete
            label="Food Category"
            v-model="category"
            :items="foodCategories"
            :rules="[validationRules.required]"
            data-testid="food-category-input"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-container>

    <h2>Nutritional Information</h2>
    <v-divider class="mb-4"></v-divider>

    <PortionEditGrid v-model="portion" />

    <h2>
      <div class="d-flex justify-space-between">
        <div>Alternative Portions</div>
        <v-btn
          density="compact"
          variant="text"
          icon="mdi-plus"
          :disabled="addPortion"
          @click="() => (addPortion = true)"
          data-testid="add-portion-button"
        ></v-btn>
      </div>
    </h2>
    <v-divider class="mb-4"></v-divider>

    <PortionEditorCard
      v-if="addPortion"
      class="pa-3"
      @cancel="() => (addPortion = false)"
      @save="saveNewPortion"
      data-testid="new-portion-editor"
    />

    <div class="pa-3" v-for="(wrapper, index) in alternativePortions" :key="index">
      <PortionDataCard
        v-if="wrapper.status === 'view'"
        :value="wrapper.portion"
        @modify="modifyPortion(index)"
        @delete="deletePortion(index)"
      />
      <PortionEditorCard
        v-else
        :portion="wrapper.portion"
        @cancel="cancelModifyPortion(index)"
        @save="(p) => saveExistingPortion(p, index)"
      />
    </div>

    <v-container fluid>
      <v-row class="pa-4" justify="end">
        <CancelButton class="mr-4" @click="$emit('cancel')" />
        <SaveButton :disabled="!(valid && isModified())" @click="save" />
      </v-row>
    </v-container>
  </v-form>
  <v-dialog v-model="showConfirmDelete" max-width="600px" data-testid="confirm-dialog">
    <ConfirmDialog
      question="Are you sure you want to delete this portion?"
      icon-color="error"
      @confirm="confirmDelete(true)"
      @cancel="confirmDelete(false)"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { foodCategories, type FoodCategory, type FoodItem, type Portion } from '@meal-planner/common';
import { ref, watch } from 'vue';
import PortionDataCard from './PortionDataCard.vue';

interface WrappedPortion {
  portion: Portion;
  status: 'view' | 'modify';
}

const props = defineProps<{ food?: FoodItem }>();
const emit = defineEmits<{ (event: 'save', payload: FoodItem): void; (event: 'cancel'): void }>();

// Reactive properties bound to form inputs
const name = ref<string>();
const brand = ref<string | null>();
const category = ref<FoodCategory | undefined>();
const portion = ref<Partial<Portion>>({});
const alternativePortions = ref<WrappedPortion[]>([]);

// Reactive properties to control the editor
const valid = ref(false);
const addPortion = ref(false);
const portionsModified = ref(false);
const showConfirmDelete = ref(false);
const confirmDelete = ref<(x: boolean) => void>(() => {});

const reset = () => {
  name.value = props.food?.name || '';
  brand.value = props.food?.brand || null;
  category.value = props.food?.category;
  portion.value = {
    units: props.food?.units,
    unitOfMeasure: props.food?.unitOfMeasure,
    grams: props.food?.grams,
    calories: props.food?.calories,
    sodium: props.food?.sodium || 0,
    sugar: props.food?.sugar || 0,
    carbs: props.food?.carbs || 0,
    fat: props.food?.fat || 0,
    protein: props.food?.protein || 0,
  };
  alternativePortions.value = (props.food?.alternativePortions || []).map((p) => ({ portion: p, status: 'view' }));
};

defineExpose({ reset });

const isModified = (): boolean => {
  if (!props.food) return true;
  if (portionsModified.value) return true;

  if (props.food.name !== name.value || props.food.brand !== brand.value || props.food.category !== category.value) {
    return true;
  }

  if (props.food.unitOfMeasure.id !== portion.value.unitOfMeasure?.id) {
    return true;
  }

  const portionFields = ['units', 'grams', 'calories', 'sodium', 'sugar', 'carbs', 'fat', 'protein'] as const;
  return portionFields.some((field) => props.food![field as keyof FoodItem] !== portion.value[field]);
};

const save = () => {
  const food: Omit<FoodItem, 'alternativePortions'> = {
    fdcId: props.food?.fdcId || null,
    name: name.value || '',
    brand: brand.value || null,
    category: category.value || 'Unknown',
    units: portion.value.units || 0,
    unitOfMeasure: portion.value.unitOfMeasure!,
    grams: portion.value.grams || 0,
    calories: portion.value.calories || 0,
    sodium: portion.value.sodium || 0,
    sugar: portion.value.sugar || 0,
    carbs: portion.value.carbs || 0,
    fat: portion.value.fat || 0,
    protein: portion.value.protein || 0,
  };
  emit(
    'save',
    props.food?.id
      ? { ...food, alternativePortions: alternativePortions.value.map((p) => p.portion), id: props.food.id }
      : { ...food, alternativePortions: alternativePortions.value.map((p) => p.portion) },
  );
};

const saveNewPortion = (portion: Portion) => {
  portionsModified.value = true;
  addPortion.value = false;
  alternativePortions.value = [{ portion, status: 'view' }, ...alternativePortions.value];
};

const saveExistingPortion = (portion: Portion, idx: number) => {
  portionsModified.value = true;
  alternativePortions.value[idx] = { portion, status: 'view' };
};

const modifyPortion = (idx: number) => {
  alternativePortions.value[idx]!.status = 'modify';
};

const cancelModifyPortion = (idx: number) => {
  alternativePortions.value[idx]!.status = 'view';
};

const deletePortion = async (idx: number) => {
  showConfirmDelete.value = true;
  const remove = await new Promise<boolean>((resolve) => {
    confirmDelete.value = resolve;
    // Watch for dialog being closed externally (e.g., ESC or click outside)
    const unwatch = watch(showConfirmDelete, (newVal) => {
      if (!newVal) {
        resolve(false);
        unwatch();
      }
    });
  });
  if (remove) {
    const newPortions = [...alternativePortions.value];
    newPortions.splice(idx, 1);
    alternativePortions.value = newPortions;
    portionsModified.value = true;
  }
  showConfirmDelete.value = false;
};

reset();
</script>
