<template>
  <v-card class="auth-card pa-5">
    <v-card-title class="text-h5">Login to Your Account</v-card-title>
    <v-card-text>
      <v-form ref="loginForm" v-model="valid" lazy-validation>
        <v-text-field v-model="email" label="Email" :rules="[rules.required, rules.email]" required></v-text-field>
        <v-text-field
          class="mt-4"
          v-model="password"
          label="Password"
          :rules="[rules.required]"
          type="password"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="login" :disabled="!valid" :loading="loading">Login</v-btn>
      <v-spacer></v-spacer>
      <v-btn text @click="forgotPassword" :disabled="loading">Forgot Password?</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const valid = ref(false);

defineProps({ loading: Boolean });
const emit = defineEmits(['login', 'forgotPassword']);

const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
};

const login = async () => {
  emit('login', {
    email: email.value,
    password: password.value,
  });
};

const forgotPassword = () => {
  emit('forgotPassword');
};
</script>
