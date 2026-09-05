/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import { routes } from 'vue-router/auto-routes';
import { useAuthentication } from '@/core/authentication';
import { isValid, parseISO } from 'date-fns';

const checkAuthStatus = async (to: RouteLocationNormalized) => {
  if (!to.meta.allowAnonymous) {
    const { isAuthenticated } = useAuthentication();
    if (!(await isAuthenticated())) {
      return '/login';
    }
  }
};

const isValidDateQueryParam = (value: unknown) => typeof value === 'string' && isValid(parseISO(value));

const validateDateParams = (to: RouteLocationNormalized) => {
  if ((to.path === '/planning/week' || to.path === '/planning/add') && !isValidDateQueryParam(to.query.weekStartDate)) {
    return '/error';
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

router.beforeEach(checkAuthStatus);
router.beforeEach(validateDateParams);

// Reload the page when a dynamic import fails due to version skew after deployment.
// See: https://vite.dev/guide/build#load-error-handling
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

export default router;
