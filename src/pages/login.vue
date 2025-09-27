<template>
  <v-btn append-icon="mdi-login" color="primary" data-testid="login-button" @click="login">Login</v-btn>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const login = async (): Promise<void> => {
  await router.replace('/dashboard');
};
</script>

<route lang="yaml">
meta:
  layout: standalone
</route>
