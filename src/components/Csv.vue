<script setup>
import { UseMainStore } from "../stores/MainStore.js"
import {
  ref,
  nextTick,
  onMounted,
  onBeforeMount,
  onUpdated,
  onUnmounted,
} from "vue"

const store = UseMainStore()

onBeforeMount(() => {
  store.GetTabels
})

onUpdated(() => {
  nextTick(() => {
    store.SaveTabels

    store.InitSeitenBerechnen()
  })
})

onMounted(() => {
  nextTick(() => {
    store.InitSeitenBerechnen()
    store.SetCurrentSeiteFirst()

    window.addEventListener("resize", () => {
      store.ResizeWindow()
    })
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
  <NoTable v-if="store.CurrentTables.length == 0" />

  <Table v-if="store.CurrentTables.length >= 1" />
  <Footer v-if="store.CurrentTables.length >= 1"></Footer>
</template>

<style scoped lang="sass">

@import "../Style.sass"
</style>
