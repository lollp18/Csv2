<script setup>
import { UseMainStore } from "../stores/MainStore.js"
import SpalteEinfügen from "./SpaltenEinfügen.vue"
import SpalteTauschen from "./SpalteTauschen.vue"
import ZeilenEinfügen from "./ZeilenEinfügen.vue"
import ZeilenTauschen from "./ZeilenTauschen.vue"
import ZellenTauschen from "./ZellenTauschen.vue"

const store = UseMainStore()
</script>
<script>
export default {
  name: "draggableContainer",
  components: {
    SpalteEinfügen,
    SpalteTauschen,
    ZeilenEinfügen,
    ZeilenTauschen,
    ZellenTauschen,
  },

  data() {
    return {
      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0,
      },
    }
  },

  methods: {
    dragMouseDown(event) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag(event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      // set the element's new position:
      this.$refs.draggableContainer.style.top =
        this.$refs.draggableContainer.offsetTop -
        this.positions.movementY +
        "px"
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        "px"
    },
    closeDragElement() {
      document.onmouseup = null
      document.onmousemove = null
    },
  },
}
</script>
<template>
  <div
    ref="draggableContainer"
    class="draggable-container">
    <div class="draggable-header">
      <slot
        name="header"
        class="draggable-header">
        <div>
          <button @mousedown="dragMouseDown">
            <ion-icon name="apps-outline"></ion-icon>
          </button>
          <button @click="store.OpenAside()">
            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
          </button>
        </div>

        <button
          class="btnclose"
          @click="store.TableBearbeitenOpen = false">
          <ion-icon name="close-outline"></ion-icon></button
      ></slot>
    </div>
    <slot name="main">
      <div class="menü-rapper">
        <aside v-if="store.TableBearbeiten.Sections.Aside">
          <button @click="store.ZeilenEinfügenAufrufen()">
            Zeilen Einfügen
          </button>
          <button @click="store.SpaltenEinfügenAufrufen()">
            Spalten Einfügen
          </button>
          <button @click="store.ZeilenTauschenAufrufen()">
            Zeilen Tauschen
          </button>
          <button @click="store.SpaltenTauschenAufrufen()">
            Spalte Tauschen
          </button>
          <button @click="store.ZellenTauschenAufrufen()">
            Zellen Tauschen
          </button>
        </aside>

        <SpalteEinfügen v-if="store.TableBearbeiten.Sections.SpalteEinfügen" />
        <SpalteTauschen v-if="store.TableBearbeiten.Sections.SpalteTauschen" />
        <ZeilenEinfügen v-if="store.TableBearbeiten.Sections.ZeileEinfügen" />
        <ZeilenTauschen v-if="store.TableBearbeiten.Sections.ZeileTauschen" />
        <ZellenTauschen v-if="store.TableBearbeiten.Sections.ZellenTauschen" />
      </div>
    </slot>
    <slot name="footer"></slot>
  </div>
</template>

<style scoped>
.menürapper {
  position: relative;
}
aside {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  position: absolute;
}

.draggable-container {
  transform: translate(-50%, -50%);

  width: 30rem;
 
}
.draggable-header {
  padding: 1rem;
  gap: 12rem;
  display: flex;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.119);
  justify-content: end;
  width: 100%;
  background-color: #fff;
}
.draggable-header button {
  width: 5rem;
}

.draggable-header div {
  display: flex;
  gap: 1rem;
}
.btnclose {
  margin-right: 5px;
  background-color: #fff;
  border: none;
  color: var(--Invalide-CloseColor);
  border: 1px solid rgba(0, 0, 0, 0.119);
}

ion-icon {
  font-size: 23px;
}
aside button {
  font-size: 1.5rem;
  width: 15rem;
  font-size: 1.6rem;
  border: 1px solid rgba(0, 0, 0, 0.119);
}
button {
  background-color: #fff;
  padding: 0.5rem;
  font-size: 0.5rem;
  width: 10rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.119);
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
}
</style>
