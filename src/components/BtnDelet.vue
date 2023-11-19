<script setup>
import { UseMainStore } from "../stores/MainStore.js"

const store = UseMainStore()
</script>
<template>
  <div  class="BtnDelet">
    <ion-icon name="close-outline"></ion-icon>
  </div>
</template>
<style scoped lang="sass">
@import "../Style.sass"
.BtnDelet
  @include Zelle()
  @include Center()
ion-icon
  font-size: 20px
</style>
