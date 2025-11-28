import type { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';
import * as components from 'vuetify/components';

export const textFieldIsRequired = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const nameInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VTextField>;
  const input = nameInput.find('input');

  expect(wrapper.text()).not.toContain('Required');
  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Required');

  await input.setValue('redrum');
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Required');
};

export const textFieldIsNotRequired = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const brandInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VTextField>;
  const input = brandInput.find('input');

  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Required');
};

export const numberInputIsRequired = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const nameInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VNumberInput>;
  const input = nameInput.find('input');

  expect(wrapper.text()).not.toContain('Required');
  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Required');

  await input.setValue(2);
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Required');
};

export const numberInputIsNotRequired = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const brandInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VNumberInput>;
  const input = brandInput.find('input');

  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Required');
};

export const autocompleteIsRequired = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const foodCategoryInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VAutocomplete>;
  const input = foodCategoryInput.find('input');

  expect(wrapper.text()).not.toContain('Required');
  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Required');
};
