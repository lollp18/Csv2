<script setup>
import { UseMainStore } from "../stores/MainStore.js"
import BtnDelet from "./BtnDelet.vue"
const store = UseMainStore()
const { CurrentTables } = UseMainStore()
</script>
<script>
export default {
  components: {
    BtnDelet,
  },
}
</script>
<template>
  <footer>
    <div class="auswahl-container">
      <div
        class="auswahl-containerItem"
        @click="store.GetSelectTabel(TableIndex)"
        v-for="({ TableName }, TableIndex) in CurrentTables"
        :key="i">
        <p
          style="font-size: 1.5rem"
          :style="{ width: TableName.length - 2 + 'rem' }">
          {{ TableName }}
        </p>
        <button
          class="BtnDeletTable"
          @click="store.InitDelet(TableIndex)">
          <ion-icon name="close-outline"></ion-icon></button
        ><a
          class="BtnDownload"
          @click="store.mDownlodFile(TableIndex)"
          :href="store.DownloadFile.Href"
          :download="TableName"
          ><ion-icon name="download-outline"></ion-icon
        ></a>
      </div>
      <button
        class="btn"
        @click="newTabelopen = true">
        <ion-icon name="add-outline"></ion-icon>
      </button>
    </div>
    <div class="seiten-rapper">
      <button
        v-if="store.SeitenVerwenden.CurrentSeite.Zahl > 1"
        class="btn-seiten-FL"
        @click="store.SeiteFirst()">
        First
      </button>
      <button
        v-if="store.SeitenVerwenden.CurrentSeite.Zahl > 1"
        class="btn-seiten"
        @click="store.SeiteZurück()">
        <ion-icon name="chevron-back-outline"></ion-icon>
      </button>
      <button class="zahl">
        {{ store.SeitenVerwenden.CurrentSeite.Zahl }}
      </button>
      <button
        v-if="
          store.SeitenVerwenden.CurrentSeite.Zahl <=
          store.SeitenVerwenden.currentSeiten.length - 1
        "
        @click="store.SeiteVor()">
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </button>
      <button
        v-if="
          store.SeitenVerwenden.CurrentSeite.Zahl <=
          store.SeitenVerwenden.currentSeiten.length - 1
        "
        @click="store.SeiteLast()">
        Last
      </button>
    </div>
  </footer>
</template>
<style scoped>
footer {
  display: flex;
  align-items: center;
}
button {
  background-color: #fff;
  padding: 1rem;

  border-radius: 10px;

  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}
ion-icon {
  font-size: 20px;
}
[name="close-outline"] {
  color: #c92a2a;
}
[name="download-outline"] {
  color: #22c55e;
}

a {
  background-color: #fff;
  padding: 1rem;

  border-radius: 10px;

  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}

.auswahl-container {
  gap: 1rem;
  display: flex;
  margin-left: 1rem;
  background-color: var(--MainColor);

  align-items: center;
  width: 90%;
}
.auswahl-containerItem {
  display: flex;
  align-items: center;
  border-radius: 10px;

  padding: 0.5rem 1rem;
  gap: 1rem;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.119);
}
/* --- Seiten Wechseln --- */

.seiten-rapper {
  padding: 1rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.zahl {
  display: flex;
  align-items: center;
  justify-content: center;
font-size: 1.8rem;
 
}
</style>
