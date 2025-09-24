import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import LoginPage from '../login.vue';
import { useRouter } from 'vue-router';

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
    expect(mountPage()).toBeDefined();
  });

  describe('login button', () => {
    it('exists', () => {
      const wrapper = mountPage();
      const button = wrapper.findComponent('[data-testid="login-button"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toBe('Login');
    });

    it('navigates to the dashboard', async () => {
      const wrapper = mountPage();
      const button = wrapper.findComponent('[data-testid="login-button"]');
      await button.trigger('click');
      expect(useRouter().replace).toHaveBeenCalledWith('/dashboard');
    });
  });
});
