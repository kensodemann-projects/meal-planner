import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NutritionalStatusMarker from '../NutritionalStatusMarker.vue';

const mountComponent = (status: 'green' | 'yellow' | 'red' | null | undefined) =>
  mount(NutritionalStatusMarker, { props: { status } });

describe('Nutritional Status Marker', () => {
  it('renders', () => {
    const wrapper = mountComponent('green');
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the green indicator when status is green', () => {
    const wrapper = mountComponent('green');
    expect(wrapper.text()).toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
    expect(wrapper.text()).not.toContain('🔴');
  });

  it('displays the yellow indicator when status is yellow', () => {
    const wrapper = mountComponent('yellow');
    expect(wrapper.text()).toContain('🟡');
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🔴');
  });

  it('displays the red indicator when status is red', () => {
    const wrapper = mountComponent('red');
    expect(wrapper.text()).toContain('🔴');
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
  });

  it('displays nothing when status is null', () => {
    const wrapper = mountComponent(null);
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
    expect(wrapper.text()).not.toContain('🔴');
  });

  it('displays nothing when status is undefined', () => {
    const wrapper = mountComponent(undefined);
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
    expect(wrapper.text()).not.toContain('🔴');
  });
});
