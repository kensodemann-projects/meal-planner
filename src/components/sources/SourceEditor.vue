<template>
  <v-form v-model="valid">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Name"
            placeholder="Enter the name of the recipe..."
            v-model="name"
            :rules="[validationRules.required, validationRules.mustBeUnique(sourceNames)]"
            data-testid="name-input"
            ref="nameInput"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row class="pa-4" justify="end">
        <CancelButton class="mr-4" @click="$emit('cancel')" />
        <SaveButton class="mr-4" :disabled="!(valid && isModified)" @click="save" />
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { shallowRef } from 'vue';

const valid = shallowRef(false);
const name = shallowRef('');
const isModified = shallowRef(false);

const save = () => {
  console.log('save');
};

//const recipeNames = computed((): string[] => recipes.value.filter((x) => x.id !== props.recipe?.id).map((x) => x.name));
const sourceNames = [] as string[];
</script>
