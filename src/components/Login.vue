<script setup>
import { UseMainStore } from "../stores/MainStore.js"

const store = UseMainStore()
</script>
<script>
export default {
  components: {},
}
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
          {{ store.AnmeldenCheck }}
        </div>
        <input
          class="new-Tabel-input"
          v-model="store.Anmelden.Email"
          placeholder="Email" />
        <input
          class="new-Tabel-input"
          v-model="store.Anmelden.Passwort"
          placeholder="Passwort" />
      </div>
      <div class="new-Tabel-btnRapper">
        <button
          @click="store.mAnmelden"
          class="btn font">
          Anmelden
        </button>

        <router-link
          :to="{ name: 'Registrieren' }"
          class="btn font">
          Registrieren
        </router-link>

        <input
          v-model="store.AngemedetBleiben"
          type="checkbox"
          name=""
          id="" />
      </div>
    </div>
  </div>
</template>
<style scoped>
:root {
  --MainColor: #fff;

  --SecondaryColor: #000;

  --table-border-color: #e9ecef;

  --Invalide-CloseColor: #c92a2a;
}

.new-Tabel-bg {
  display: flex;
  justify-content: center;
  align-items: center;

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
