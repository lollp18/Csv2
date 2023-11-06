<script>
import { RouterView } from "vue-router"

export default {
  components: {
    RouterView,
  },
}
</script>

<template>
  <router-view></router-view>
</template>

<style>
/* --- Global Styls --- */
:root {
  --MainColor: #fff;

  --SecondaryColor: #000;

  --table-border-color: #e9ecef;

  --Invalide-CloseColor: #c92a2a;
}

#app {
  display: flex;
  flex-direction: column;

  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
html {
  font-size: 62.5%;
  overflow: hidden;
  height: 100vh;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
  color: var(--SecondaryColor);
  background: var(--MainColor);
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
