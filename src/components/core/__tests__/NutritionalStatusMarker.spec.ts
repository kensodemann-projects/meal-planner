import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import NutritionalStatusMarker from '../NutritionalStatusMarker.vue';
import type { NutritionalStatus } from '@/core/nutritional-status';

const mountComponent = (status: NutritionalStatus | null) => mount(NutritionalStatusMarker, { props: { status } });

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

  it('displays the green indicator when status is in-zone', () => {
    wrapper = mountComponent('in-zone');
    expect(wrapper.text()).toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
    expect(wrapper.text()).not.toContain('🔴');
  });

  it('displays the yellow indicator when status is low-warn', () => {
    wrapper = mountComponent('low-warn');
    expect(wrapper.text()).toContain('🟡');
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🔴');
  });

  it('displays the red indicator when status is low-danger', () => {
    wrapper = mountComponent('low-danger');
    expect(wrapper.text()).toContain('🔴');
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
  });

  it('displays the yellow indicator when status is high-warn', () => {
    wrapper = mountComponent('high-warn');
    expect(wrapper.text()).toContain('🟡');
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🔴');
  });

  it('displays the red indicator when status is high-danger', () => {
    wrapper = mountComponent('low-danger');
    expect(wrapper.text()).toContain('🔴');
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
  });

  it('displays nothing when status is null', () => {
    wrapper = mountComponent(null);
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
    expect(wrapper.text()).not.toContain('🔴');
  });
});
