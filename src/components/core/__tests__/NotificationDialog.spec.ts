import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import NotificationDialog, { type MessageType } from '../NotificationDialog.vue';

describe('Notification Dialog', () => {
  const vuetify = createVuetify({ components, directives });
  const mountComponent = (message: string, type?: MessageType, title = 'Notification') =>
    mount(NotificationDialog, { global: { plugins: [vuetify] }, props: { message, title, ...(type ? { type } : {}) } });

  let wrapper: ReturnType<typeof mountComponent>;

  afterEach(() => {
    wrapper?.unmount();
    vi.clearAllTimers();
    try {
      vi.useRealTimers();
    } catch {}
  });

  it('displays the message', () => {
    const message = 'This is the message that I will display.';
    wrapper = mountComponent(message);
    expect(wrapper.find('[data-testid="body"]').text()).toBe(message);
  });

  it('displays the title', () => {
    const title = 'Source in use';
    wrapper = mountComponent('This is the message that I will display.', undefined, title);
    expect(wrapper.find('[data-testid="title"]').text()).toBe(title);
  });

  it('emits confirm on ok pressed', async () => {
    wrapper = mountComponent('This is the message that I will display.');
    const button = wrapper.find('[data-testid="ok-button"]');
    await button.trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
  });

  it('displays the error icon and color when type is error', () => {
    wrapper = mountComponent('This is the message that I will display.', 'error');
    const icon = wrapper.findComponent(components.VIcon);
    expect(icon.props('icon')).toBe('mdi-alert-circle');
    expect(icon.props('color')).toBe('error');
  });

  it('displays the warning icon and color when type is warning', () => {
    wrapper = mountComponent('This is the message that I will display.', 'warning');
    const icon = wrapper.findComponent(components.VIcon);
    expect(icon.props('icon')).toBe('mdi-alert');
    expect(icon.props('color')).toBe('warning');
  });

  it('displays the info icon and color when type is info', () => {
    wrapper = mountComponent('This is the message that I will display.', 'info');
    const icon = wrapper.findComponent(components.VIcon);
    expect(icon.props('icon')).toBe('mdi-information');
    expect(icon.props('color')).toBe('info');
  });

  it('defaults to the info icon and color', () => {
    wrapper = mountComponent('This is the message that I will display.');
    const icon = wrapper.findComponent(components.VIcon);
    expect(icon.props('icon')).toBe('mdi-information');
    expect(icon.props('color')).toBe('info');
  });
});
