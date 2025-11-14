import { useAuthentication } from '@/core/authentication';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import DefaultLayout from '../default.vue';
import { beforeEach } from 'vitest';
import { useRouter } from 'vue-router';
import { type Mock } from 'vitest';

vi.mock('@/core/authentication');
vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountComponent = () =>
  mount(
    {
      template: '<v-layout><DefaultLayout></DefaultLayout></v-layout>',
    },
    {
      props: {},
      global: {
        components: {
          DefaultLayout,
        },
        plugins: [vuetify],
        stubs: {
          'router-view': true,
        },
      },
    },
  );

describe('DefaultLayout', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(async () => {
    await flushPromises();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
    wrapper?.unmount();
  });

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      replace: vi.fn(),
    });
  });

  it('displays the menu items for this application', () => {
    wrapper = mountComponent();
    const items = wrapper.findAllComponents(components.VListItem);
    expect(items.length).toBe(7);
    expect(items[0]?.text()).toBe('Dashboard');
    expect(items[1]?.text()).toBe('Planning');
    expect(items[2]?.text()).toBe('Shopping');
    expect(items[3]?.text()).toBe('Foods');
    expect(items[4]?.text()).toBe('Recipes');
    expect(items[5]?.text()).toBe('Settings');
    expect(items[6]?.text()).toBe('Logout');
  });

  it('calls the logout if logout is clicked', async () => {
    const { logout } = useAuthentication();
    wrapper = mountComponent();
    const items = wrapper.findAllComponents(components.VListItem);
    await items[items.length - 1]?.trigger('click');
    expect(logout).toHaveBeenCalledExactlyOnceWith();
  });

  it('navigates to the login page if logout is successful', async () => {
    const router = useRouter();
    wrapper = mountComponent();
    const items = wrapper.findAllComponents(components.VListItem);
    await items[items.length - 1]?.trigger('click');
    expect(router.replace).toHaveBeenCalledExactlyOnceWith('/login');
  });
});
