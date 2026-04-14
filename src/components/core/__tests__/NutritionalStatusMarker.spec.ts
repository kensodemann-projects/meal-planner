import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import NutritionalStatusMarker from '../NutritionalStatusMarker.vue';

const mountComponent = (status: 'green' | 'yellow' | 'red' | null | undefined) =>
  mount(NutritionalStatusMarker, { props: { status } });

describe('Nutritional Status Marker', () => {
  let wrapper: ReturnType<typeof mountComponent> | undefined;

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('renders', () => {
    wrapper = mountComponent('green');
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the green indicator when status is green', () => {
    wrapper = mountComponent('green');
    expect(wrapper.text()).toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
    expect(wrapper.text()).not.toContain('🔴');
  });

  it('displays the yellow indicator when status is yellow', () => {
    wrapper = mountComponent('yellow');
    expect(wrapper.text()).toContain('🟡');
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🔴');
  });

  it('displays the red indicator when status is red', () => {
    wrapper = mountComponent('red');
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

  it('displays nothing when status is undefined', () => {
    wrapper = mountComponent(undefined);
    expect(wrapper.text()).not.toContain('🟢');
    expect(wrapper.text()).not.toContain('🟡');
    expect(wrapper.text()).not.toContain('🔴');
  });
});
