<script setup>
import { UseMainStore } from "../stores/MainStore.js"

const store = UseMainStore()
</script>
<template>
  <div class="box">
    <h1>Zeilen Einfügen</h1>
    <input
      v-model="store.TableBearbeiten.Einfügen.Zeilen.Zeile"
      placeholder="Welche zeile"
      type="number" />
    <select @change="store.GetOptionZeile">
      <option value="Ü">Über</option>
      <option value="U">Unter</option>
    </select>
    <input
      v-model="store.TableBearbeiten.Einfügen.Zeilen.Anzahl"
      placeholder="Anzahl"
      type="number" />
    <button @click="store.ZeilenEinfügen()">
      <ion-icon name="add-outline"></ion-icon>
    </button>
  </div>
</template>
<style scoped>
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
h1 {
  font-size: 2rem;
  font-weight: 600;
  font-family: "Roboto", sans-serif;
  color: #000;
  text-transform: uppercase;
  text-shadow: 1px 1px 0px #fff, 1px 2px 3px #fff,
    1px 1px 1px rgba(16, 16, 16, 0.5), 1px 1px 1px rgba(16, 16, 16, 0.4),
    1px 5px 10px rgba(16, 16, 16, 0.3), 1px 10px 10px rgba(16, 16, 16, 0.2);
}
input {
  padding: 0.7rem;
  font-size: 1.5rem;
  border-radius: 10px;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}
select {
  padding: 1rem;
  font-size: 1.5rem;
  border-radius: 10px;
  width: 10rem;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}
option {
  padding: 1rem;
  font-size: 1.5rem;
  border-radius: 10px;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}

button {
  background-color: #fff;
  padding: 1rem;

  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}
ion-icon {
  font-size: 20px;
}
</style>
