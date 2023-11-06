import { createRouter, createWebHashHistory } from "vue-router"
import Login from "../components/Login.vue"
import Registrieren from "../components/Registrieren.vue"
import Csv from "../components/Csv.vue"

const routes = [
  { name: "Login", path: "/", component: Login },
  {
    name: "Registrieren",
    path: "/Registrieren",
    component: Registrieren,
  },
  { name: "Csv", path: "/Csv", component: Csv },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
