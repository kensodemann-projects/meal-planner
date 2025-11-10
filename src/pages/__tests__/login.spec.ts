import { useAuthentication } from '@/core/authentication';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import LoginPage from '../login.vue';
import { useRouter } from 'vue-router';

vi.mock('@/core/authentication');
vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(LoginPage, { global: { plugins: [vuetify] } });

describe('LoginPage', () => {
  let wrapper: ReturnType<typeof mountPage>;

  afterEach(() => {
    wrapper?.unmount();
  });

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      replace: vi.fn(),
    });
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  describe('on login', () => {
    it('calls the login method', () => {
      const { login } = useAuthentication();
      wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'LoginCard' });
      loginCard.vm.$emit('login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(login).toHaveBeenCalledExactlyOnceWith('test@example.com', 'password123');
    });

    it('navigates to dashboard', async () => {
      const router = useRouter();
      wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'LoginCard' });

      await loginCard.vm.$emit('login', {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(router.replace).toHaveBeenCalledWith('/dashboard');
      expect(router.replace).toHaveBeenCalledTimes(1);
    });

    it('shows error message on login failure', async () => {
      const { login } = useAuthentication();
      wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'LoginCard' });

      (login as Mock).mockRejectedValue(new Error('Invalid credentials'));

      await loginCard.vm.$emit('login', {
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      await flushPromises();

      const alert = wrapper.findComponent({ name: 'VAlert' });
      expect(alert.exists()).toBe(true);
      expect(alert.text()).toBe('Login failed. Please try again.');
    });
  });

  describe('on reset password ', () => {
    it('calls the sendPasswordReset method', () => {
      const { sendPasswordReset } = useAuthentication();
      wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'LoginCard' });
      loginCard.vm.$emit('resetPassword', {
        email: 'test@example.com',
      });
      expect(sendPasswordReset).toHaveBeenCalledExactlyOnceWith('test@example.com');
    });

    it('alerts the user on password reset', async () => {
      wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'LoginCard' });
      loginCard.vm.$emit('resetPassword', {
        email: 'test@example.com',
      });
      await flushPromises();

      const alert = wrapper.findComponent({ name: 'VAlert' });
      expect(alert.exists()).toBe(true);
      expect(alert.text()).toBe(
        'Password reset email sent. Please check your inbox for further instructions. Be sure to look in your spam folder if you do not see it right away.',
      );
    });

    it('shows error message on password reset failure', async () => {
      const { sendPasswordReset } = useAuthentication();
      wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'LoginCard' });

      (sendPasswordReset as Mock).mockRejectedValue(new Error('Email not found'));

      loginCard.vm.$emit('resetPassword', {
        email: 'test@example.com',
      });
      await flushPromises();

      const alert = wrapper.findComponent({ name: 'VAlert' });
      expect(alert.exists()).toBe(true);
      expect(alert.text()).toBe('Failed to send password reset email. Please try again.');
    });
  });
});
