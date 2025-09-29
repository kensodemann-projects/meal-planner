<template>
  <div>
    <app-login-card :loading="loading" @login="onLogin" @resetPassword="onResetPassword" />
    <v-alert v-if="message" :type="messageType" class="error-message mt-4" @click="clearMessage">
      {{ message }}
    </v-alert>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthentication } from '@/core/authentication';
import { useRouter } from 'vue-router';

const router = useRouter();
const { login, sendPasswordReset } = useAuthentication();
const message = ref<string>('');
const messageType = ref<'error' | 'success'>('error');
const loading = ref(false);

const clearMessage = (): void => {
  message.value = '';
};

const onResetPassword = async ({ email }: { email: string }): Promise<void> => {
  try {
    clearMessage();
    await sendPasswordReset(email);
    message.value =
      'Password reset email sent. Please check your inbox for further instructions. Be sure to look in your spam folder if you do not see it right away.';
    messageType.value = 'success';
  } catch {
    message.value = 'Failed to send password reset email. Please try again.';
    messageType.value = 'error';
  }
};

const onLogin = async ({ email, password }: { email: string; password: string }): Promise<void> => {
  try {
    clearMessage();
    loading.value = true;
    await login(email, password);
    await router.replace('/dashboard');
  } catch {
    message.value = 'Login failed. Please try again.';
    messageType.value = 'error';
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
