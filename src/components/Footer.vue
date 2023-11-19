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
        v-for="({ TableName }, TableIndex) in CurrentTables"
        :key="i">
        <button @click="store.GetSelectTabel(TableIndex)">
          {{ TableName }}
        </button>
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
<style scoped lang="sass">

@import "../Style.sass"
footer
  display: flex
  align-items: center
  

ion-icon
  font-size: 20px


[name="download-outline"]
  color: #22c55e

a
  @include Button()

.auswahl-container
  gap: 1rem
  display: flex
  margin-left: 1rem
  background-color: $MainColor
  align-items: center
  width: 90%


.auswahl-containerItem
  @include Button()
  gap: 1rem
  padding: .5rem

/* --- Seiten Wechseln --- */

.seiten-rapper
  display: flex
  justify-content: flex-end
  gap: 0.5rem



.zahl
  @include Center()
  font-size: 1.8rem
</style>
