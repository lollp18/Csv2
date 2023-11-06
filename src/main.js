import { createApp } from "vue"
import { createPinia } from "pinia"
import PrimeVue from "primevue/config"
import App from "./App.vue"
import router from "./router"
import VueCookies from "vue-cookies"
const app = createApp(App)
app.use(VueCookies)

app.use(createPinia())
app.use(router)

app.mount("#app")
