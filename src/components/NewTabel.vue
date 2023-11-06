<script>

export default {
 
  computed: {
   
  },
  data() {
    return {
      invalidZeile: false,
      invalidSpalte: false,
      invalidName: false,
    }
  },
  methods: {
    tabellErstellen() {
      this.$store.commit("ChecknewTabellName")

      if (
        this.$store.getters.NewTabellName == "" ||
        this.$store.getters.NewTabellName == undefined ||
        this.$store.getters.CheckTabellName == true
      ) {
        this.invalidName = true
      } else {
        this.invalidName = false
      }

      if (
        this.$store.getters.NewTabellZeile <= 0 ||
        this.$store.getters.NewTabellZeile == undefined
      ) {
        this.invalidZeile = true
      } else {
        this.invalidZeile = false
      }

      if (
        this.$store.getters.NewTabellSpalte <= 0 ||
        this.$store.getters.NewTabellSpalte == undefined
      ) {
        this.invalidSpalte = true
      } else {
        this.invalidSpalte = false
      }

      if (
        this.invalidZeile == false &&
        this.invalidSpalte == false &&
        this.invalidName == false
      ) {
        this.$store.commit("CreateNewTabellData")
        this.$store.commit("InserteNewTabellTabel")
        this.$emit("close")
      }
    },
  },
}
</script>
<template>
  <Teleport to="#new-Tabel">
    <Transition>
      <div
        class="new-Tabel-bg"
        v-if="open">
        <div class="new-Tabel">
          <div class="new-Tabel-Input-rapper">
            <input
              :class="
                invalidName ? 'new-Tabel-input-invalid' : 'new-Tabel-input'
              "
              v-model="NewTabellName"
              placeholder="Tabellen Name" />
            <input
              :class="
                invalidZeile ? 'new-Tabel-input-invalid' : 'new-Tabel-input'
              "
              v-model="NewTabellZeile"
              placeholder="Anzahl der Zeilen" />
            <input
              :class="
                invalidSpalte ? 'new-Tabel-input-invalid' : 'new-Tabel-input'
              "
              v-model="NewTabellSpalte"
              placeholder="Anzahl der spalten" />
          </div>
          <div class="new-Tabel-btnRapper">
            <button
              @click="tabellErstellen"
              class="btn font">
              Tabelle Generiren
            </button>
            <button
              @click="$emit('close')"
              class="btn font">
              Abrechen
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.new-Tabel-bg {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}
.new-Tabel {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--MainColor);
  border: 2px solid var(--SecondaryColor);
  gap: 3rem;
  padding: 4rem 4rem;
  height: 40rem;
  width: 50rem;
  border-radius: 5px;
}

.new-Tabel-Input-rapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.new-Tabel-input {
  background-color: var(--MainColor);
  border: 2px solid var(--SecondaryColor);
  font-size: 1.8rem;
  padding: 0.5rem 0.5rem;
}
.new-Tabel-input-invalid {
  background-color: var(--MainColor);
  border: 2px solid var(--Invalide-CloseColor);
  font-size: 1.8rem;
  padding: 0.5rem 0.5rem;
}
.new-Tabel-btnRapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.font {
  font-size: 1.8rem;
}
</style>
