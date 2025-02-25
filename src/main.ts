import { createApp } from 'vue';
import { Notify, Quasar } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

import { createPinia } from 'pinia';
import router from '@/router';
import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(Quasar, {
  plugins: { Notify },
});
app.use(createPinia());
app.mount('#app');
