<template>
  <v-form v-model="valid">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Name"
            placeholder="Enter the name of the food source..."
            v-model="name"
            :rules="[validationRules.required, validationRules.mustBeUnique(sourceNames)]"
            data-testid="name-input"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea label="Description" v-model="description" data-testid="description-input"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field label="URL" v-model="url" data-testid="url-input"></v-text-field>
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
const description = shallowRef(props.source?.description ?? '');
const url = shallowRef(props.source?.url ?? '');

const { sources } = useSourcesData();
const sourceNames = computed((): string[] => sources.value.filter((x) => x.id !== props.source?.id).map((x) => x.name));
const isModified = computed((): boolean =>
  props.source
    ? name.value !== props.source.name ||
      description.value !== (props.source.description ?? '') ||
      url.value !== (props.source.url ?? '')
    : true,
);

const save = () => {
  const payload: Source = { id: props.source?.id, name: name.value };
  const trimmedDescription = description.value.trim();
  const trimmedUrl = url.value.trim();
  if (trimmedDescription) payload.description = trimmedDescription;
  if (trimmedUrl) payload.url = trimmedUrl;
  emit('save', payload);
};
</script>
