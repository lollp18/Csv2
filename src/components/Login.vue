<script setup>
import { UseMainStore } from "../stores/MainStore.js"
import TableLite from "vue3-table-lite";
const store = UseMainStore()
</script>
<script>
export default {
  components: {},
}
</script>
<template>
  <div class="FormRapper">
    <form>
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

      <button
        @click.prevent="store.mAnmelden"
        class="btn font">
        Anmelden
      </button>

      <router-link
        :to="{ name: 'Registrieren' }"
        class="router-link">
        Registrieren
      </router-link>

      <input
        class="checkbox"
        v-model="store.AngemedetBleiben"
        type="checkbox" />
    </form>
  </div>
</template>
<style scoped lang="sass">

@import "../Style.sass"
.FormRapper
  @include Center()
  width: 100%
  height: 100%
input
  font-size: 1.8rem
button
  font-size: 1.8rem

form
  @include Center()
  @include DreiD()
  flex-direction: column
  background-color: $MainColor

  gap: 3rem
  padding: 4rem 4rem
  height: 40rem
  width: 50rem
  border-radius: 10px
  font-size: 1.8rem
.router-link
  @include Button()
  text-decoration: none
.checkbox
  width: 2rem
</style>
