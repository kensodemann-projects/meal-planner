import { useAuthentication } from '@/core/authentication';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
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
  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      replace: vi.fn(),
    });
  });

  it('renders', () => {
    expect(mountPage().exists()).toBe(true);
  });

  describe('on login', () => {
    it('calls the login method', () => {
      const { login } = useAuthentication();
      const wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'AppLoginCard' });
      loginCard.vm.$emit('login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(login).toHaveBeenCalledExactlyOnceWith('test@example.com', 'password123');
    });

    it('navigates to dashboard', async () => {
      const router = useRouter();
      const wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'AppLoginCard' });

      await loginCard.vm.$emit('login', {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(router.replace).toHaveBeenCalledWith('/dashboard');
      expect(router.replace).toHaveBeenCalledTimes(1);
    });

    it('shows error message on login failure', async () => {
      const { login } = useAuthentication();
      const wrapper = mountPage();
      const loginCard = wrapper.findComponent({ name: 'AppLoginCard' });

      (login as Mock).mockRejectedValue(new Error('Invalid credentials'));

      await loginCard.vm.$emit('login', {
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      await wrapper.vm.$nextTick();

      const alert = wrapper.findComponent({ name: 'VAlert' });
      expect(alert.exists()).toBe(true);
      expect(alert.text()).toBe('Login failed. Please try again.');
    });
  });
});
