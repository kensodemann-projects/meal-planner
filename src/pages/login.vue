<template>
  <div>
    <app-login-card :loading="loading" @login="onLogin" @forgotPassword="onForgotPassword" />
    <v-alert v-if="errorMessage" type="error" class="error-message mt-4" @click="clearError">
      {{ errorMessage }}
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthentication } from '@/core/authentication';
import { useRouter } from 'vue-router';

const router = useRouter();
const { login } = useAuthentication();
const errorMessage = ref<string>('');
const loading = ref(false);

const clearError = (): void => {
  errorMessage.value = '';
};

const onForgotPassword = async (): Promise<void> => {
  console.log('Forgot password clicked');
};

const onLogin = async ({ email, password }: { email: string; password: string }): Promise<void> => {
  try {
    clearError();
    loading.value = true;
    await login(email, password);
    await router.replace('/dashboard');
  } catch {
    errorMessage.value = 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@media (min-width: 0px) {
  .auth-card {
    margin-top: 25%;
    margin-left: 5%;
    margin-right: 5%;
  }

  .error-message {
    margin-left: 5%;
    margin-right: 5%;
  }
}

@media (min-width: 576px) {
  .auth-card {
    margin-top: 20%;
    margin-left: 10%;
    margin-right: 10%;
  }

  .error-message {
    margin-left: 10%;
    margin-right: 10%;
  }
}

@media (min-width: 768px) {
  .auth-card {
    margin-top: 10%;
    margin-left: 20%;
    margin-right: 20%;
  }

  .error-message {
    margin-left: 20%;
    margin-right: 20%;
  }
}

@media (min-width: 992px) {
  .auth-card {
    margin-top: 10%;
    margin-left: 25%;
    margin-right: 25%;
  }

  .error-message {
    margin-left: 25%;
    margin-right: 25%;
  }
}

@media (min-width: 1200px) {
  .auth-card {
    margin-top: 10%;
    margin-left: 30%;
    margin-right: 30%;
  }

  .error-message {
    margin-left: 30%;
    margin-right: 30%;
  }
}
</style>

<route lang="yaml">
meta:
  layout: standalone
</route>
