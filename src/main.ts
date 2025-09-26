import { registerPlugins } from '@/plugins';
import 'unfonts.css';
import { createApp } from 'vue';
import { VueFire, VueFireAuth } from 'vuefire';
import App from './App.vue';
import { useFirebaseApp } from './core/firebase-app';

const { app: firebaseApp } = useFirebaseApp();
const app = createApp(App).use(VueFire, { firebaseApp, modules: [VueFireAuth()] });

registerPlugins(app);
app.mount('#app');
