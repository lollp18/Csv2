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
store.$subscribe(async () => {

})
onBeforeMount(async () => {
  await store.CheckLogin()
  await store.SetApiUrlUserTables()
  await store.GetTabels()
})

onUpdated(() => {
  nextTick(() => {
    store.SaveTabels()
    store.InitSeitenBerechnen()
    store.SetCurrentSeiteFirst()
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

import NewTable from "./NewTable.vue"
import Bearbeiten from "./Bearbeiten.vue"
import Header from "./Header.vue"
import Table from "./Table.vue"
import NoTable from "./NoTable.vue"
import Footer from "./Footer.vue"

// Others

import { ref } from "vue"

export default {
  methods: {
    // check and set

    ResteFile() {
      this.$refs.fileInput.value = null
    },
  },
}
</script>

<template>
  <Bearbeiten v-if="store.TableBearbeitenOpen" />
  <NewTable v-if="store.NewTableIsOpen" />

  <Header />
  <NoTable v-if="store.CurrentTables.length == 0" />

  <Table v-if="store.CurrentTables.length >= 1" />
  <Footer v-if="store.CurrentTables.length >= 1" />
</template>

<style scoped lang="sass">

@import "../Style.sass"
</style>
