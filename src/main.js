import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import store from './store'
const pinia = createPinia()

createApp(App).use(store).use(pinia).mount('#app')

export { pinia }
