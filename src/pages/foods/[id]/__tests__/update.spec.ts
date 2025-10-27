import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import UpdatePage from '../update.vue';
import { useRoute } from 'vue-router';

vi.mock('vue-router');

const vuetify = createVuetify({
  components,
  directives,
});
const mountPage = () => mount(UpdatePage, { global: { plugins: [vuetify] } });

describe('Food Update Page', () => {
  beforeEach(() => {
    (useRoute as Mock).mockReturnValue({ params: { id: '88f933fiieo' } });
  });

  it('renders', () => {
    const wrapper = mountPage();
    expect(wrapper.exists()).toBe(true);
  });
});
