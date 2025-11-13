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

    <NutritionalInformationEditGrid v-model="portion" />

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

    <NutritionalInformationEditor
      v-if="addPortion"
      class="pa-3"
      @cancel="() => (addPortion = false)"
      @save="saveNewPortion"
      data-testid="new-portion-editor"
    />

    <div class="pa-3" v-for="(portion, index) in alternativePortions" :key="index">
      <v-card>
        <v-card-text>
          <NutritionalInformation :value="portion" compact />
        </v-card-text>
        <v-card-actions>
          <ModifyButton />
          <DeleteButton @click="deletePortion(index)" />
        </v-card-actions>
      </v-card>
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
import { foodCategories, type FoodItem, type Portion } from '@/models';
import { ref } from 'vue';
import NutritionalInformationEditor from './NutritionalInformationEditor.vue';

const props = defineProps<{ food?: FoodItem }>();
const emit = defineEmits<{ (event: 'save', payload: FoodItem): void; (event: 'cancel'): void }>();

const valid = ref(false);
const name = ref(props.food?.name);
const brand = ref(props.food?.brand);
const category = ref(props.food?.category);
const portion = ref({
  units: props.food?.units,
  unitOfMeasure: props.food?.unitOfMeasure,
  grams: props.food?.grams,
  calories: props.food?.calories,
  sodium: props.food?.sodium || 0,
  sugar: props.food?.sugar || 0,
  carbs: props.food?.carbs || 0,
  fat: props.food?.fat || 0,
  protein: props.food?.protein || 0,
});
const addPortion = ref(false);
const alternativePortions = ref(props.food?.alternativePortions || []);
const portionsModified = ref(false);
const showConfirmDelete = ref(false);
const confirmDelete = ref<(x: boolean) => void>(() => {});

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
      ? { ...food, alternativePortions: alternativePortions.value, id: props.food.id }
      : { ...food, alternativePortions: alternativePortions.value },
  );
};

const saveNewPortion = (portion: Portion) => {
  portionsModified.value = true;
  addPortion.value = false;
  alternativePortions.value = [portion, ...alternativePortions.value];
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
</script>
