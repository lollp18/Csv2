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
  <table>
    <tbody>
      <tr>
        <!-- Tabel Header BTN Delet -->
        <div class="rapperTop-btnDelet">
          <div class="zelle-placeholder"></div>
          <div class="zelle-placeholder"></div>
          <BtnDelet @click="store.SpalteLöschen(0)" />
          <div
            v-for="NummberFirstZeile in store.CurrentTable.TableData[0].length -
            1"
            :key="NummberFirstZeile">
            <BtnDelet
              @click="store.SpalteLöschen(NummberFirstZeile)"
              v-if="
                NummberFirstZeile > 0 &&
                NummberFirstZeile >= store.SeitenVerwenden.CurrentSeite.Start &&
                NummberFirstZeile <= store.SeitenVerwenden.CurrentSeite.Ende
              " />
          </div>
        </div>
        <!-- Tabel Header Spalten Nummern -->
        <div class="rapperTop-btnDelet">
          <div class="zelle-placeholder"></div>
          <div class="zelle-placeholder"></div>
          <div class="zelle-nummer">1</div>
          <div
            v-for="NummberFirstZeile in store.CurrentTable.TableData[0].length -
            1"
            :key="NummberFirstZeile">
            <div
              class="zelle-nummer"
              v-if="
                NummberFirstZeile > 0 &&
                NummberFirstZeile >= store.SeitenVerwenden.CurrentSeite.Start &&
                NummberFirstZeile <= store.SeitenVerwenden.CurrentSeite.Ende
              ">
              {{ NummberFirstZeile + 1 }}
            </div>
          </div>
        </div>
        <!-- Tabel Header Data -->
        <td class="t-header">
          <BtnDelet @click="store.ZeileLöschen(0)" />
          <div class="zelle-nummer">1</div>
          <div class="t-header">
            <div
              ref="zelle"
              :class="
                store.CurrentTable.TableData[0][0].Activ
                  ? 'zelle-activ'
                  : 'zelle'
              "
              @click="
                store.InitZelleBerarbeiten(
                  0,
                  0,
                  store.CurrentTable.TableData[0][0].ZellenInhalt
                )
              ">
              {{ store.CurrentTable.TableData[0][0].ZellenInhalt }}
            </div>
            <div
              v-for="({ Activ, ZellenInhalt }, ZellenIndex) in store
                .CurrentTable.TableData[0]"
              :key="ZellenIndex">
              <div
                v-if="
                  ZellenIndex > 0 &&
                  ZellenIndex >= store.SeitenVerwenden.CurrentSeite.Start &&
                  ZellenIndex <= store.SeitenVerwenden.CurrentSeite.Ende
                "
                :class="Activ ? 'zelle-activ' : 'zelle'"
                @click="
                  store.InitZelleBerarbeiten(0, ZellenIndex, ZellenInhalt)
                ">
                {{ ZellenInhalt }}
              </div>
            </div>
          </div>
        </td>
      </tr>
      <!-- Tabel Seitenleiste -->
      <tr class="t-ab-raper">
        <!-- Tabel Seitenleiste BTN Delet -->
        <div>
          <div
            class="rapperSide-btnDelet"
            v-for="NummernTableData in store.CurrentTable.TableData.length - 1"
            :key="NummernTableData">
            <btnDelet
              v-if="NummernTableData != 0"
              @click="store.ZeileLöschen(NummernTableData)" />
          </div>
        </div>
        <!-- Tabel Seitenleiste Zeilen Nummern -->
        <div>
          <div
            class="rapperSide-btnDelet"
            v-for="NummernTableData in store.CurrentTable.TableData.length - 1"
            :key="NummernTableData">
            <div
              class="zelle-nummer"
              v-if="NummernTableData != 0">
              {{ NummernTableData + 1 }}
            </div>
          </div>
        </div>
        <!-- Tabel Seitenleiste  Data-->
        <td class="t-aside">
          <div
            v-for="(Zeile, ZeileIndex) in store.CurrentTable.TableData"
            :key="ZeileIndex">
            <div v-if="ZeileIndex != 0">
              <div
                v-for="({ Activ, ZellenInhalt }, ZellenIndex) in Zeile"
                :key="ZellenIndex">
                <div
                  :class="Activ ? 'zelle-activ' : 'zelle'"
                  @click="
                    store.InitZelleBerarbeiten(
                      ZeileIndex,
                      ZellenIndex,
                      ZellenInhalt
                    )
                  "
                  v-if="ZellenIndex < 1">
                  {{ ZellenInhalt }}
                </div>
              </div>
            </div>
          </div>
        </td>
        <!-- Tabel Body Data -->
        <td class="t-body">
          <div
            v-for="(Zeile, ZeileIndex) in store.CurrentTable.TableData"
            :key="ZeileIndex">
            <div
              class="zeile"
              v-if="ZeileIndex != 0">
              <div
                v-for="({ Activ, ZellenInhalt }, ZellenIndex) in Zeile"
                :key="ZellenIndex">
                <div
                  :class="Activ ? 'zelle-activ' : 'zelle'"
                  @click="
                    store.InitZelleBerarbeiten(
                      ZeileIndex,
                      ZellenIndex,
                      ZellenInhalt
                    )
                  "
                  v-if="
                    ZellenIndex > 0 &&
                    ZellenIndex >= store.SeitenVerwenden.CurrentSeite.Start &&
                    ZellenIndex <= store.SeitenVerwenden.CurrentSeite.Ende
                  ">
                  {{ ZellenInhalt }}
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
/* --- Global Styls --- */
:root {
  --MainColor: #fff;

  --SecondaryColor: #000;

  --table-border-color: #e9ecef;

  --Invalide-CloseColor: #c92a2a;
}
[name="close-outline"] {
  color: #c92a2a;
}
[name="download-outline"] {
  color: #22c55e;
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

ion-icon {
  padding: 2px;
  font-size: 25px;
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
  height: 60%;
  flex-direction: column;
  border-collapse: collapse;

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
