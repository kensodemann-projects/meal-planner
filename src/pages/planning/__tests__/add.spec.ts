import MealItemEditor from '@/components/meals/MealItemEditor.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import add from '../add.vue';

vi.mock('vue-router');
vi.mock('@/data/recipes');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = (props = {}) => mount(add, { props, global: { plugins: [vuetify] } });
const renderPage = async (props = {}) => {
  const wrapper = mountPage(props);
  await flushPromises();
  return wrapper;
};

describe('add', () => {
  let wrapper: ReturnType<typeof mountPage>;

  beforeEach(() => {
    (useRoute as Mock).mockReturnValue({
      query: { weekStartDate: '2025-12-29' },
    });
    (useRouter as Mock).mockReturnValue({
      back: vi.fn(),
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the page heading', async () => {
    wrapper = await renderPage();
    expect(wrapper.find('h1').text()).toBe('Add Daily Meal Plan');
  });

  it('renders MealItemEditor with the week start date from the route', async () => {
    wrapper = await renderPage();
    const editor = wrapper.findComponent(MealItemEditor);
    expect(editor.exists()).toBe(true);
    expect(editor.props('weekStartDate')).toBe('2025-12-29');
  });

  describe('on cancel', () => {
    it('navigates back to the previous page', async () => {
      wrapper = await renderPage();
      const editor = wrapper.findComponent(MealItemEditor);
      editor.vm.$emit('cancel');
      await flushPromises();
      const { back } = useRouter();
      expect(back).toHaveBeenCalledTimes(1);
    });
  });
});
