<script setup>
import { UseMainStore } from "../stores/MainStore.js"
import BtnDelet from "./BtnDelet.vue"
const store = UseMainStore()
</script>
<script>
export default {
  components: {
    BtnDelet,
  },
}
</script>
<template>
  <header>
    <nav>
      <input
        class="file-upload"
        type="file"
        @change="store.GetFileData"
        accept=".csv" />
      <button v-if="store.CurrentTables.length >= 1" @click="store.TableBearbeitenOpen = true">
        <ion-icon name="create-outline"></ion-icon>
      </button>

      <button
        class="btn"
        v-show="store.ShowLogoutBTN"
        @click="store.Abmelden">
        Abmelden
      </button>
    </nav>

    <div
      class="tabel-info"
      v-if="store.CurrentTables.length >= 1">
      <input
        @input="store.SetCurrentTabelName()"
        class="tabel-name"
        placeholder="Tabellenname"
        v-model="store.CurrentTable.TableName" />
      <input
        class="zellen-inhalt"
        placeholder="Zelleninhalt"
        type="text"
        @input="store.SetZellenValue()"
        v-model="store.CurrentTable.CurrentZelle.ZellenInhalt" />

      <input placeholder="" />
    </div>
  </header>
</template>
<style scoped>
button {
  background-color: #fff;
  padding: 1rem;

  border-radius: 10px;

  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}
input {
  padding: 0.7rem;
  font-size: 1.5rem;
  border-radius: 10px;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}
ion-icon {
  font-size: 20px;
}
/* --- Header --- */
header {
  display: flex;
  flex-direction: column;

  height: 15%;
}
nav {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
}
.file-upload {
  padding: 0;
  font-size: none;
  border-radius: none;
  border: none;
  box-shadow: none;
  border: none;
}
.add-tabellEL {
  height: 100%;
}

.btn:link {
  text-decoration: none;
}
::-webkit-file-upload-button {
  background-color: #fff;
  padding: 1rem;

  border-radius: 10px;

  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}

/* Tabel Header */

.tabel-info {
  display: flex;
  gap: 1rem;
}
.tabel-name {
  width: 10%;
}
.zellen-inhalt {
  width: 90%;
}
</style>
