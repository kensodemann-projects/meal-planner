import { mount, VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import TextAutocomplete from '../TextAutocomplete.vue';

const vuetify = createVuetify({ components, directives });

const defaultProps = {
  label: 'Food',
  items: ['Apple', 'Banana', 'Apricot', 'Cherry'],
  rules: [],
};

const createWrapper = (props = {}, modelValue: string | null = null) => {
  return mount(TextAutocomplete, {
    props: { ...defaultProps, ...props, modelValue },
    global: { plugins: [vuetify] },
  });
};

describe('TextAutocomplete', () => {
  let wrapper: VueWrapper<any>;

  afterEach(() => wrapper?.unmount());

  it('renders a VAutocomplete with the given label', () => {
    wrapper = createWrapper({ label: 'Ingredient' });
    const autocomplete = wrapper.findComponent({ name: 'VAutocomplete' });
    expect(autocomplete.props('label')).toBe('Ingredient');
  });

  it('passes items to VAutocomplete', () => {
    wrapper = createWrapper();
    const autocomplete = wrapper.findComponent({ name: 'VAutocomplete' });
    expect(autocomplete.props('items')).toEqual(defaultProps.items);
  });

  it('passes rules to VAutocomplete', () => {
    const rules = [(v: string) => !!v || 'Required'];
    wrapper = createWrapper({ rules });
    const autocomplete = wrapper.findComponent({ name: 'VAutocomplete' });
    expect(autocomplete.props('rules')).toEqual(rules);
  });

  describe('Tab key — selectFirstItem', () => {
    it('selects the first matching item on Tab when search matches', async () => {
      wrapper = createWrapper();
      const input = wrapper.find('input');

      await input.setValue('ap');
      await input.trigger('keydown.tab');

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Apple']);
    });

    it('matching is case-insensitive', async () => {
      wrapper = createWrapper();
      const input = wrapper.find('input');

      await input.setValue('BAN');
      await input.trigger('keydown.tab');

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Banana']);
    });

    it('sets modelValue to null on Tab when search is empty', async () => {
      wrapper = createWrapper({}, 'Apple');
      const input = wrapper.find('input');

      await input.setValue('');
      await input.trigger('keydown.tab');

      const emissions = wrapper.emitted('update:modelValue');
      expect(emissions?.[emissions.length - 1]).toEqual([null]);
    });

    it('sets modelValue to null on Tab when search matches nothing', async () => {
      wrapper = createWrapper({}, 'Apple');
      const input = wrapper.find('input');

      await input.setValue('zzz');
      await input.trigger('keydown.tab');

      const emissions = wrapper.emitted('update:modelValue');
      expect(emissions?.[emissions.length - 1]).toEqual([null]);
    });
  });
});
