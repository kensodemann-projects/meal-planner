<template>
  <h1 class="text-center">Pick a Recipe Type</h1>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card @click="console.log('choice a')" data-testid="choice-homemade">
          <v-card-text>
            <div class="d-flex align-center ga-2">
              <v-icon size="large" icon="mdi-pasta"></v-icon>
              <div>
                <div>Homemade</div>
                <div>Simple to complex, some assembly is required.</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card @click="console.log('choice b')" data-testid="choice-prepared">
          <v-card-text>
            <div class="d-flex align-center ga-2">
              <v-icon size="large" icon="mdi-chef-hat"></v-icon>
              <div>
                <div>Prepared</div>
                <div>Premade meals from a delivery service or restaurant.</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
//
</script>

<style scoped></style>
