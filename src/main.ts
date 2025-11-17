import { registerPlugins } from '@/plugins';
import 'unfonts.css';
import { createApp } from 'vue';
import { VueFire, VueFireAuth } from 'vuefire';
import App from './App.vue';
import { useFirebaseApp } from './core/firebase-app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const { app: firebaseApp } = useFirebaseApp();

if (import.meta.env.DEV || window.location.hostname === 'localhost') {
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  console.log('Connecting to emulator...');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

const app = createApp(App).use(VueFire, { firebaseApp, modules: [VueFireAuth()] });

registerPlugins(app);
app.mount('#app');
