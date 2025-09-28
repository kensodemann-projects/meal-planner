import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import AppLoginCard from '../AppLoginCard.vue';

const vuetify = createVuetify({
  components,
  directives,
});

const createWrapper = (props = {}) => {
  return mount(
    {
      template: '<v-layout><app-login-card v-bind="$attrs" @login="() => null"></app-login-card></v-layout>',
    },
    {
      props,
      global: {
        components: {
          AppLoginCard,
        },
        plugins: [vuetify],
      },
    },
  );
};

const getButtons = (wrapper: ReturnType<typeof createWrapper>) => {
  const buttons = wrapper.findAll('button');
  const loginButton = buttons.find((btn) => btn.text() === 'Login')!;
  const forgotPasswordButton = buttons.find((btn) => btn.text() === 'Forgot Password?')!;
  return { loginButton, forgotPasswordButton };
};

const getInputs = (wrapper: ReturnType<typeof createWrapper>) => {
  const emailInput = wrapper.find('input[type="text"]')!;
  const passwordInput = wrapper.find('input[type="password"]')!;
  return { emailInput, passwordInput };
};

describe('AppLoginCard', () => {
  it('renders the login form with correct title', () => {
    const wrapper = createWrapper();
    const title = wrapper.findComponent(components.VCardTitle);
    expect(title.text()).toBe('Login to Your Account');
  });

  it('renders email and password fields', () => {
    const wrapper = createWrapper();
    const inputs = wrapper.findAllComponents(components.VTextField);
    expect(inputs).toHaveLength(2);
    expect(inputs[0].props('label')).toBe('Email');
    expect(inputs[1].props('label')).toBe('Password');
  });

  it('renders login and forgot password buttons', () => {
    const wrapper = createWrapper();
    const buttons = wrapper.findAllComponents(components.VBtn);
    expect(buttons).toHaveLength(2);
    expect(buttons[0].text()).toBe('Login');
    expect(buttons[1].text()).toBe('Forgot Password?');
  });

  it('disables login button when form is invalid', async () => {
    const wrapper = createWrapper();
    const { loginButton } = getButtons(wrapper);
    expect(loginButton.attributes('disabled')).toBeDefined();
  });

  it('enables login button when form is valid', async () => {
    const wrapper = createWrapper();
    const { loginButton } = getButtons(wrapper);
    const { emailInput, passwordInput } = getInputs(wrapper);

    expect(loginButton.attributes('disabled')).toBeDefined();

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    await wrapper.vm.$nextTick();

    expect(loginButton.exists()).toBe(true);
    expect(loginButton.attributes('disabled')).toBeUndefined();
  });

  it('validates email format', async () => {
    const wrapper = createWrapper();
    const { emailInput } = getInputs(wrapper);
    await emailInput.setValue('invalid-email');
    await emailInput.trigger('blur');
    expect(wrapper.text()).toContain('E-mail must be valid');
  });

  it('validates email is required', async () => {
    const wrapper = createWrapper();
    const { emailInput } = getInputs(wrapper);

    await emailInput.trigger('focus');
    await emailInput.trigger('blur');
    expect(wrapper.text()).toContain('Required');

    await emailInput.setValue('test@test.com');
    await emailInput.trigger('blur');
    expect(wrapper.text()).not.toContain('Required');
  });

  it('validates password is required', async () => {
    const wrapper = createWrapper();
    const { passwordInput } = getInputs(wrapper);

    await passwordInput.trigger('focus');
    await passwordInput.trigger('blur');
    expect(wrapper.text()).toContain('Required');

    await passwordInput.setValue('foorbar');
    await passwordInput.trigger('blur');
    expect(wrapper.text()).not.toContain('Required');
  });

  it('emits login event when login is clicked', async () => {
    const wrapper = createWrapper();
    const loginCard = wrapper.findComponent(AppLoginCard);
    const { emailInput, passwordInput } = getInputs(wrapper);
    const { loginButton } = getButtons(wrapper);

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');
    await loginButton.trigger('click');

    expect(loginCard.emitted('login')).toBeTruthy();
    expect(loginCard.emitted('login')).toHaveLength(1);

    // Check that the event includes email and password payload
    const loginEvent = loginCard.emitted('login')?.[0];
    expect(loginEvent).toBeDefined();
    expect(loginEvent?.[0]).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('handles forgot password click', async () => {
    const wrapper = createWrapper();
    const loginCard = wrapper.findComponent(AppLoginCard);
    const { forgotPasswordButton } = getButtons(wrapper);

    await forgotPasswordButton.trigger('click');

    expect(loginCard.emitted('forgotPassword')).toBeTruthy();
    expect(loginCard.emitted('forgotPassword')).toHaveLength(1);
  });

  it('applies correct CSS classes', () => {
    const wrapper = createWrapper();
    const card = wrapper.find('.auth-card');
    expect(card.exists()).toBe(true);
    expect(card.classes()).toContain('pa-5');
  });
});
