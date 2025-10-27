import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SearchInput from '../SearchInput.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const createWrapper = (props = {}) => {
  return mount(SearchInput, {
    props,
    global: {
      plugins: [vuetify],
    },
  });
};

describe('SearchInput', () => {
  it('renders with default props', () => {
    const wrapper = createWrapper();
    const textField = wrapper.findComponent({ name: 'VTextField' });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.search-input').exists()).toBe(true);

    expect(textField.props('label')).toBe('Search');
    expect(textField.props('placeholder')).toBe('Search...');

    const button = wrapper.find('button');
    expect(button.text()).toBe('Search');
  });

  it('renders with custom props', () => {
    const props = {
      label: 'Find Items',
      placeholder: 'Enter item name...',
      buttonLabel: 'Find',
      isSearching: false,
    };

    const wrapper = createWrapper(props);

    const textField = wrapper.findComponent({ name: 'VTextField' });
    expect(textField.props('label')).toBe('Find Items');
    expect(textField.props('placeholder')).toBe('Enter item name...');

    const button = wrapper.find('button');
    expect(button.text()).toBe('Find');
  });

  it('shows loading state when isSearching is true', () => {
    const wrapper = createWrapper({ isSearching: true });

    const textField = wrapper.findComponent({ name: 'VTextField' });
    expect(textField.props('loading')).toBe(true);

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('emits search event when button is clicked', async () => {
    const wrapper = createWrapper();

    const textField = wrapper.findComponent({ name: 'VTextField' });
    await textField.setValue('test search');

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.emitted('search')).toBeTruthy();
    expect(wrapper.emitted('search')).toHaveLength(1);
    expect(wrapper.emitted('search')?.[0]).toEqual(['test search']);
  });

  it('emits search event when Enter key is pressed', async () => {
    const wrapper = createWrapper();

    const textField = wrapper.findComponent({ name: 'VTextField' });
    await textField.setValue('keyboard search');

    const input = wrapper.find('input');
    await input.trigger('keyup.enter');

    expect(wrapper.emitted('search')).toBeTruthy();
    expect(wrapper.emitted('search')).toHaveLength(1);
    expect(wrapper.emitted('search')?.[0]).toEqual(['keyboard search']);
  });

  it('disables button when search text is empty', async () => {
    const wrapper = createWrapper();
    const button = wrapper.find('button');
    const textField = wrapper.findComponent({ name: 'VTextField' });

    expect(button.attributes('disabled')).toBeDefined();

    await textField.setValue('some text');
    expect(button.attributes('disabled')).toBeUndefined();

    await textField.setValue('');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('disables button when search text contains only whitespace', async () => {
    const wrapper = createWrapper();
    const textField = wrapper.findComponent({ name: 'VTextField' });
    const button = wrapper.find('button');

    await textField.setValue('   ');
    expect(button.attributes('disabled')).toBeDefined();

    await textField.setValue('  valid text  ');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('does not emit search event when button is disabled', async () => {
    const wrapper = createWrapper();
    const button = wrapper.find('button');

    await button.trigger('click');
    expect(wrapper.emitted('search')).toBeFalsy();
  });

  it('disables interactions when isSearching is true', async () => {
    const wrapper = createWrapper({ isSearching: true });
    const button = wrapper.find('button');
    const textField = wrapper.findComponent({ name: 'VTextField' });

    await textField.setValue('test');
    expect(button.attributes('disabled')).toBeDefined();
    await button.trigger('click');
    expect(wrapper.emitted('search')).toBeFalsy();
  });

  it('has clearable input field', () => {
    const wrapper = createWrapper();

    const textField = wrapper.findComponent({ name: 'VTextField' });
    expect(textField.props('clearable')).toBe(true);
  });

  it('uses outlined variant for text field', () => {
    const wrapper = createWrapper();

    const textField = wrapper.findComponent({ name: 'VTextField' });
    expect(textField.props('variant')).toBe('outlined');
  });

  it('applies correct CSS classes', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.search-input').exists()).toBe(true);
  });

  it('handles multiple search operations correctly', async () => {
    const wrapper = createWrapper();

    const textField = wrapper.findComponent({ name: 'VTextField' });
    const button = wrapper.find('button');

    await textField.setValue('first search');
    await button.trigger('click');

    await textField.setValue('second search');
    await button.trigger('click');

    expect(wrapper.emitted('search')).toHaveLength(2);
    expect(wrapper.emitted('search')?.[0]).toEqual(['first search']);
    expect(wrapper.emitted('search')?.[1]).toEqual(['second search']);
  });

  it('trims the search text before emitting', async () => {
    const wrapper = createWrapper();
    const textField = wrapper.findComponent({ name: 'VTextField' });
    const button = wrapper.find('button');

    await textField.setValue('   trimmed search   ');
    await button.trigger('click');

    expect(wrapper.emitted('search')?.[0]).toEqual(['trimmed search']);
  });

  it('maintains button primary color', () => {
    const wrapper = createWrapper();

    const button = wrapper.findComponent({ name: 'VBtn' });
    expect(button.props('color')).toBe('primary');
  });

  it('trims whitespace correctly in disabled state logic', async () => {
    const wrapper = createWrapper();
    const textField = wrapper.findComponent({ name: 'VTextField' });
    const button = wrapper.find('button');
    const whitespaceValues = ['', ' ', '  ', '\t', '\n', '   \t\n  '];

    for (const value of whitespaceValues) {
      await textField.setValue(value);
      expect(button.attributes('disabled')).toBeDefined();
    }

    const validValues = [' valid ', '\tvalid\t', '\nvalid\n'];

    for (const value of validValues) {
      await textField.setValue(value);
      expect(button.attributes('disabled')).toBeUndefined();
    }
  });
});
