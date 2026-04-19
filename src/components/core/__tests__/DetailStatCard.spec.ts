import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import type { NutritionalStatus } from '@/core/nutritional-status';
import DetailStatCard from '../DetailStatCard.vue';
import NutritionalStatusMarker from '../NutritionalStatusMarker.vue';

const vuetify = createVuetify({
  components,
  directives,
});

type DetailStatCardProps = {
  icon: string;
  label: string;
  status?: NutritionalStatus;
  value: number | string;
};

const mountComponent = (props: DetailStatCardProps = { icon: 'mdi-fire', label: 'Calories', value: '320 kcal' }) =>
  mount(DetailStatCard, { props, global: { plugins: [vuetify] } });

describe('Detail Stat Card', () => {
  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('renders', () => {
    wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the icon', () => {
    wrapper = mountComponent();
    expect(wrapper.html()).toContain('mdi-fire');
  });

  it('displays the label and value', () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain('Calories:');
    expect(wrapper.text()).toContain('320 kcal');
  });

  it('displays numeric values', () => {
    wrapper = mountComponent({ icon: 'mdi-counter', label: 'Servings', value: 4 });
    expect(wrapper.text()).toContain('Servings:');
    expect(wrapper.text()).toContain('4');
  });

  it('displays a NutritionalStatusMarker when status is set', () => {
    wrapper = mountComponent({ icon: 'mdi-fire', label: 'Calories', value: '320 kcal', status: 'high-warn' });
    const marker = wrapper.findComponent(NutritionalStatusMarker);
    expect(marker.exists()).toBe(true);
    expect(marker.props('status')).toBe('high-warn');
  });

  it('does not display a NutritionalStatusMarker when status is not set', () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(NutritionalStatusMarker).exists()).toBe(false);
  });
});
