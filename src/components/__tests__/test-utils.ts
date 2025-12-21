import type { VueWrapper } from '@vue/test-utils';
import { expect } from 'vitest';
import * as components from 'vuetify/components';

export const textFieldIsRequired = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const textField = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VTextField>;
  const input = textField.find('input');

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
  const textField = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VTextField>;
  const input = textField.find('input');

  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Required');
};

export const numberInputIsRequired = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const numberInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VNumberInput>;
  const input = numberInput.find('input');

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
  const numberInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VNumberInput>;
  const input = numberInput.find('input');

  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Required');
};

export const numberInputMustBePositive = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const numberInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VNumberInput>;
  const input = numberInput.find('input');

  expect(wrapper.text()).not.toContain('Must be a positive number');
  await input.trigger('focus');
  await input.setValue(0);
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Must be a positive number');
  await input.setValue(2);
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Must be a positive number');

  await input.setValue(-2);
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Must be a positive number');
};

export const numberInputMustBeZeroOrGreater = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const numberInput = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VNumberInput>;
  const input = numberInput.find('input');

  expect(wrapper.text()).not.toContain('Must be zero or greater');
  await input.trigger('focus');
  await input.setValue(0);
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Must be zero or greater');
  await input.setValue(-0.001);
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Must be zero or greater');
  await input.setValue(0.001);
  await input.trigger('blur');
  expect(wrapper.text()).not.toContain('Must be zero or greater');

  await input.setValue(-2);
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Must be zero or greater');
};

export const autocompleteIsRequired = async <T>(wrapper: VueWrapper<T>, testId: string) => {
  const autocomplete = wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper<components.VAutocomplete>;
  const input = autocomplete.find('input');

  expect(wrapper.text()).not.toContain('Required');
  await input.trigger('focus');
  await input.setValue('');
  await input.trigger('blur');
  expect(wrapper.text()).toContain('Required');
};
