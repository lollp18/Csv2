<script setup>
import { UseMainStore } from "../stores/MainStore.js"
import { ref, onMounted, onBeforeMount, onUpdated, onUnmounted } from "vue"

const store = UseMainStore()

const { CurrentTables } = UseMainStore()

onBeforeMount(() => {
  store.GetTabels
  store.HasTabels()
})

onUpdated(() => {
  store.SaveTabels
  store.HasTabels()
  store.InitSeitenBerechnen()
})

onMounted(() => {
  store.InitSeitenBerechnen()
  store.SetCurrentSeiteFirst()
  window.addEventListener("resize", () => {
    store.ResizeWindow()
  })
})

onUnmounted(() => {
  window.removeEventListener("resize")
})
</script>

<script>
// Compnents

import newTabel from "./NewTabel.vue"
import Bearbeiten from "./Bearbeiten.vue"
import ZellenTauschen from "./ZellenTauschen.vue"
import Header from "./Header.vue"
import Table from "./Table.vue"
import NoTable from "./NoTable.vue"
import Footer from "./Footer.vue"

// Others

import { ref } from "vue"

export default {
  components: {
    newTabel,
    Bearbeiten,
    ZellenTauschen,
  },
  computed: {},
  data() {
    return {
      darkMode: false,

      tabelhidde: true,
      noTabelhidde: false,
      newTabelopen: ref(false),
      Tbearbeiten: ref(false),
      ZellenTauschen: ref(false),
    }
  },
  methods: {
    getSelectTabel(e) {
      this.$store.commit("getSelectTabel", e)
    },

    // check and set

    ResteFile() {
      this.$refs.fileInput.value = null
    },
  },
}
</script>

<template>
  <bearbeiten v-show="store.TableBearbeitenOpen" />
  <newTabel
    :open="newTabelopen"
    @close="newTabelopen = false" />

  <Header />
  <NoTable v-if="CurrentTables.length == 0" />

  <Table v-if="CurrentTables.length >= 1" />
  <Footer v-if="CurrentTables.length >= 1"></Footer>
</template>

<style scoped>
/* --- Global Styls --- */
:root {
  --MainColor: #fff;

  --SecondaryColor: #000;

  --table-border-color: #e9ecef;

  --Invalide-CloseColor: #c92a2a;
}

.btnDelet {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--table-border-color);
  background-color: var(--MainColor);
  height: 2.5rem;
  width: 7.9rem;
}

.hidde {
  display: none;
}

/* --- components --- */

.draggable-container {
  top: 50%;
  left: 50%;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.119);
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  position: absolute;
  z-index: 99;

  background-color: var(--MainColor);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.menü-rapper {
  display: flex;
  flex-direction: column;

  height: 90%;
}

.invalid {
  border: 2px solid var(--Invalide-CloseColor);
}

/* Main Tabel */

.rapperTop-btnDelet {
  display: flex;
  overflow: hidden;
}
.rapperSide-btnDelet {
  display: flex;
  flex-direction: column;
}
table {
  display: flex;

  flex-direction: column;
  border-collapse: collapse;
  height: 100%;
  width: 100vw;
  font-size: 10pt;
  padding: 0;
  margin: 0;
}
tbody {
  border: 2px solid var(--table-border-color);
}
.t-header {
  display: flex;
  overflow: hidden;
}
.header-zeile {
  overflow: hidden;
  text-align: center;
  border: 1px solid var(--table-border-color);

  height: 2.5rem;
  width: 7.9rem;
}
.t-ab-raper {
  display: flex;
  height: 70vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.t-aside {
  display: flex;
  flex-direction: column;
  width: 7.9rem;
  height: 100%;
}
.aside {
  display: flex;
  flex-direction: column;
}
.aside-zeile {
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 1px solid var(--table-border-color);
}
.t-body {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.zeile {
  display: flex;
}
/* --- Zellen ---  */
.zelle {
  overflow: hidden;
  text-align: center;
  border: 1px solid var(--table-border-color);

  height: 2.5rem;
  width: 7.9rem;
  transition: all 0.3ms;
}

.zelle:hover {
  border: 1px solid var(--SecondaryColor);
}
.zelle-activ {
  overflow: hidden;
  text-align: center;
  border: 1.9px solid var(--SecondaryColor);

  height: 2.5rem;
  width: 7.9rem;
  transition: all 0.3ms;
}
.zelle-placeholder {
  border: 1px solid var(--table-border-color);
  background-color: #f8f9fa;
  height: 2.5rem;
  width: 7.9rem;
}
.zelle-nummer {
  text-align: center;
  border: 1px solid var(--table-border-color);

  height: 2.5rem;
  width: 7.9rem;
}
</style>
