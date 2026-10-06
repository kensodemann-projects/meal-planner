<template>
  <h1 class="text-center">Pick a Recipe Type</h1>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card @click="router.push('/recipes/add-homemade')" data-testid="choice-homemade">
          <v-card-text>
            <div class="d-flex align-center ga-2">
              <v-icon size="x-large" icon="mdi-gas-burner"></v-icon>
              <div>
                <div class="text-title-large">Homemade</div>
                <div>Simple to complex, some assembly is required.</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card @click="router.push('/recipes/add-prepared')" data-testid="choice-prepared">
          <v-card-text>
            <div class="d-flex align-center ga-2">
              <v-icon size="x-large" icon="mdi-chef-hat"></v-icon>
              <div>
                <div class="text-title-large">Prepared</div>
                <div>Premade meals from a delivery service or restaurant.</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container fluid>
    <v-row class="pa-4" justify="end">
      <CancelButton class="mr-4" @click="router.replace('/recipes')" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
