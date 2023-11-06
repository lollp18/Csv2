<script setup>
import { UseMainStore } from "../stores/MainStore.js"

const store = UseMainStore()
</script>
<script>
export default {}
</script>
<template>
  <div class="new-Tabel-bg">
    <div class="new-Tabel">
      <div class="new-Tabel-Input-rapper">
        <div
          style="
            display: flex;
            justify-content: center;
            font-size: medium;
            color: red;
          ">
          {{ store.RegistrierenCheck }}
        </div>
        <input
          class="new-Tabel-input"
          v-model="store.Registrieren.Username"
          placeholder="Username" />
        <input
          class="new-Tabel-input"
          v-model="store.Registrieren.Email"
          placeholder="Email" />
        <input
          class="new-Tabel-input"
          v-model="store.Registrieren.Passwort"
          placeholder="Passwort" />
        <input
          class="new-Tabel-input"
          v-model="store.Registrieren.PasswortWiederholen"
          placeholder="Passwort wiederholen" />
      </div>
      <div class="new-Tabel-btnRapper">
        <button
          @click="store.mRegistrieren"
          class="btn font">
          Registrieren
        </button>

        <router-link
          :to="{ name: 'Login' }"
          class="btn font">
          Login
        </router-link>
      </div>
    </div>
  </div>
</template>
<style scoped>
.new-Tabel-bg {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}
.new-Tabel {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--MainColor);
  border: 2px solid var(--SecondaryColor);
  gap: 3rem;
  padding: 4rem 4rem;
  height: 40rem;
  width: 50rem;
  border-radius: 5px;
}

.new-Tabel-Input-rapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.new-Tabel-input {
  background-color: var(--MainColor);
  border: 2px solid var(--SecondaryColor);
  font-size: 1.8rem;
  padding: 0.5rem 0.5rem;
}
.new-Tabel-input-invalid {
  background-color: var(--MainColor);
  border: 2px solid var(--Invalide-CloseColor);
  font-size: 1.8rem;
  padding: 0.5rem 0.5rem;
}
.new-Tabel-btnRapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.font {
  font-size: 1.8rem;
}
</style>
