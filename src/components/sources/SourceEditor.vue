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
import { useSourcesData } from '@/data/sources';
import type { Source } from '@/models/source';
import { computed, shallowRef } from 'vue';

const props = defineProps<{ source?: Source }>();
const emit = defineEmits<{ (event: 'save', payload: Source): void; (event: 'cancel'): void }>();

const valid = shallowRef(false);
const name = shallowRef(props.source?.name ?? '');

const { sources } = useSourcesData();
const sourceNames = computed((): string[] => sources.value.filter((x) => x.id !== props.source?.id).map((x) => x.name));
const isModified = computed((): boolean => (props.source ? name.value !== props.source.name : true));

const save = () => {
  emit('save', { id: props.source?.id, name: name.value });
};
</script>
