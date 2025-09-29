<template>
  <v-card class="auth-card pa-5">
    <v-card-title class="text-h5">{{
      resetMode ? 'Get Password Reset Instructions' : 'Login to Your Account'
    }}</v-card-title>
    <v-card-text>
      <div class="mb-8" v-if="resetMode">
        Please enter your email address. If your email is associated with a valid active account, we will send an
        instructional email with a password reset link. Use that link to reset your password.
      </div>
      <v-form ref="loginForm" v-model="valid" lazy-validation>
        <v-text-field v-model="email" label="Email" :rules="[rules.required, rules.email]" required></v-text-field>
        <v-text-field
          v-if="!resetMode"
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
      <v-btn color="primary" @click="login" :disabled="!valid" :loading="loading">{{
        resetMode ? 'Send Reset Instructions' : 'Login'
      }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn text @click="forgotPassword" :disabled="loading">{{ resetMode ? 'Cancel' : 'Forgot Password?' }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const valid = ref(false);
const resetMode = ref(false);

defineProps({ loading: Boolean });
const emit = defineEmits(['login', 'resetPassword']);

const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
};

const login = async () => {
  resetMode.value
    ? emit('resetPassword', {
        email: email.value,
      })
    : emit('login', {
        email: email.value,
        password: password.value,
      });
  resetMode.value = false;
};

const forgotPassword = () => {
  resetMode.value = !resetMode.value;
};
</script>
