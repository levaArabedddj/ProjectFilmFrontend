import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; 
import { plugin as FormKitPlugin, defaultConfig } from "@formkit/vue";



const app = createApp(App);
const pinia = createPinia(); // Создаем экземпляр Pinia
app.use(FormKitPlugin, defaultConfig); // ✅ Додаємо конфігурацію
app.use(router); // Подключаем роутер
app.use(pinia); // Подключаем Pinia
app.mount('#app');
