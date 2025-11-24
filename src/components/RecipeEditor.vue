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
            ref="nameInput"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { validationRules } from '@/core/validation-rules';
import { onMounted, ref } from 'vue';
import type { VTextField } from 'vuetify/components';

const valid = ref(false);
const name = ref('');

const nameInput = ref<InstanceType<typeof VTextField> | null>(null);

onMounted(() => nameInput.value?.focus());
</script>
