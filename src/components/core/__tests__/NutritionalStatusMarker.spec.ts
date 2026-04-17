import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NutritionalStatusMarker from '../NutritionalStatusMarker.vue';
import type { NutritionalStatus } from '@/core/nutritional-status';

const vuetify = createVuetify({ components, directives });

const mountComponent = (status: NutritionalStatus | null) =>
  mount(NutritionalStatusMarker, { props: { status }, global: { plugins: [vuetify] } });

describe('Nutritional Status Marker', () => {
  let wrapper: ReturnType<typeof mountComponent> | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('renders', () => {
    wrapper = mountComponent('in-zone');
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the success circle icon when status is in-zone', () => {
    wrapper = mountComponent('in-zone');
    expect(wrapper.html()).toContain('mdi-circle');
    expect(wrapper.html()).toContain('text-success');
    expect(wrapper.html()).not.toContain('mdi-arrow');
  });

  it('displays the warning down arrow when status is low-warn', () => {
    wrapper = mountComponent('low-warn');
    expect(wrapper.html()).toContain('mdi-arrow-down-bold');
    expect(wrapper.html()).toContain('text-warning');
    expect(wrapper.html()).not.toContain('mdi-circle');
    expect(wrapper.html()).not.toContain('text-error');
  });

  it('displays the error down arrow when status is low-danger', () => {
    wrapper = mountComponent('low-danger');
    expect(wrapper.html()).toContain('mdi-arrow-down-bold');
    expect(wrapper.html()).toContain('text-error');
    expect(wrapper.html()).not.toContain('mdi-circle');
    expect(wrapper.html()).not.toContain('text-warning');
  });

  it('displays the warning up arrow when status is high-warn', () => {
    wrapper = mountComponent('high-warn');
    expect(wrapper.html()).toContain('mdi-arrow-up-bold');
    expect(wrapper.html()).toContain('text-warning');
    expect(wrapper.html()).not.toContain('mdi-circle');
    expect(wrapper.html()).not.toContain('text-error');
  });

  it('displays the error up arrow when status is high-danger', () => {
    wrapper = mountComponent('high-danger');
    expect(wrapper.html()).toContain('mdi-arrow-up-bold');
    expect(wrapper.html()).toContain('text-error');
    expect(wrapper.html()).not.toContain('mdi-circle');
    expect(wrapper.html()).not.toContain('text-warning');
  });

  it('displays nothing when status is null', () => {
    wrapper = mountComponent(null);
    expect(wrapper.html()).not.toContain('mdi-circle');
    expect(wrapper.html()).not.toContain('mdi-arrow');
  });
});
