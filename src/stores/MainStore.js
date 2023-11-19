import { defineStore } from "pinia"
import axios from "axios"
import router from "../router/index.js"
import { Table, Zelle } from "../components/Classes.js"

import papa from "papaparse"
export const UseMainStore = defineStore("csv", {
  state: () => ({
    UserData: undefined,

    CurrentTable: {
      TableName: "no Tabel",
      TableData: new Map([
        [
          1,
          new Map([
            [1, { Activ: false, ZellenInhalt: "" }],
            [2, { Activ: false, ZellenInhalt: "" }],
            [3, { Activ: false, ZellenInhalt: "" }],
            [4, { Activ: false, ZellenInhalt: "" }],
            [5, { Activ: false, ZellenInhalt: "" }],
          ]),
        ],
        [
          2,
          new Map([
            [1, { Activ: false, ZellenInhalt: "" }],
            [2, { Activ: false, ZellenInhalt: "" }],
            [3, { Activ: false, ZellenInhalt: "" }],
            [4, { Activ: false, ZellenInhalt: "" }],
            [5, { Activ: false, ZellenInhalt: "" }],
          ]),
        ],
      ]),
      LastZelle: {
        Zeile: 0,
        Spalten: 0,
        ZellenInhalt: "",
        Activ: false,
      },
      CurrentZelle: {
        Zeile: undefined,
        Spalten: undefined,
        ZellenInhalt: "",
        Activ: false,
      },
    },
    CurrentTables: [],
    CurrentTabelleID: undefined,

    TabelenGröße: {
      höhe: 0,
      breite: 0,
    },

    // Uploade Download CSV File

    UploadeFile: {
      fileName: "",
      data: [],
    },
    DownloadFile: {
      Href: "",
      Data: undefined,
    },

    //Tabelle bearbeiten
    TableBearbeitenOpen: false,
    TableBearbeiten: {
      Error: undefined,

      Sections: {
        ZeileEinfügen: true,
        SpalteEinfügen: false,
        ZeileTauschen: false,
        SpalteTauschen: false,
        ZellenTauschen: false,
        Aside: false,
      },

      Einfügen: {
        Zeilen: {
          Zeile: undefined,
          Position: "Ü",
          Anzahl: undefined,
        },
        Spalten: { Spalte: undefined, Position: "L", Anzahl: undefined },
      },

      Tauschen: {
        Zeilen: {
          Erste: undefined,
          Zweite: undefined,
        },
        Spalten: {
          Erste: undefined,
          Zweite: undefined,
        },
      },
      ZellenTauschen: {
        ErsteZelle: {
          Zeile: undefined,
          Spalte: undefined,
        },
        ZweiteZelle: {
          Zeile: undefined,
          Spalte: undefined,
        },
      },
      ZeileTemp: {
        zeile: new Map(),
        InsertPositon: undefined,
      },
      SpalteTemp: {
        spalten: [],
        InsertPositon: undefined,
      },
    },

    // Neue Tabelle erstellen

    newTabell: {
      name: "",
      zeilen: undefined,
      spalten: undefined,
      data: [],
      checkTabellName: false,
    },

    // Registrieren
    Registrieren: {
      Username: undefined,
      Email: undefined,
      Passwort: undefined,
      PasswortWiederholen: undefined,
    },
    RegistrierenCheck: undefined,
    // Login

    Anmelden: {
      Email: "lorenzo123696@gmail.com",
      Passwort: "123",
    },
    AnmeldenCheck: undefined,

    AngemedetBleiben: false,
    // Seiten

    SeitenVerwenden: {
      currentSeiten: [],
      seitenLängeMax: 0,
      seitenLängeMin: 0,
      zellenWidth: 77,
      seitenAnzahl: 0,
      windowHeight: document.documentElement.clientWidth,

      CurrentSeite: {
        Zahl: 1,
        Start: 1,
        Ende: undefined,
      },
    },

    ApiURLs: {
      ApiUrlUsersRegistrieren: "http://localhost:8080/auth/registrieren",
      ApiUrlUsersAnmelden: "http://localhost:8080/auth/login",
      ApiUrlUserTabellen: undefined,
    },
  }),
  getters: {
    name: (state) => state,
    FirstZeileLength: (state) => state.CurrentTable.TableData.get(1).size,
    CurrentSeiteStart: (state) => state.SeitenVerwenden.CurrentSeite.Start,
    CurrentSeiteEnde: (state) => state.SeitenVerwenden.CurrentSeite.Ende,
    FirstZelleActive: (state) =>
      state.CurrentTable.TableData.get(1).get(1).Activ,
    FirstZelleZellenInhalt: (state) =>
      state.CurrentTable.TableData.get(1).get(1).ZellenInhalt,
    FirstZeile: (state) => state.CurrentTable.TableData.get(1),
    CurrentTableLength: (state) => state.CurrentTable.TableData.size,
    CurrentTableTableData: (state) => state.CurrentTable.TableData,
    name: (state) => state,
    name: (state) => state,
    name: (state) => state,
  },
  actions: {
    InitSeitenBerechnen() {
      this.SetTabelSize()
      this.BrechneMax()
      this.SeitenBerechnen()
    },

    SetCurrentSeiteFirst() {
      this.SeitenVerwenden.CurrentSeite = this.SeitenVerwenden.currentSeiten[0]
    },

    BrechneMax() {
      this.SeitenVerwenden.seitenLängeMax = Math.round(
        (this.SeitenVerwenden.windowHeight - 200) /
          this.SeitenVerwenden.zellenWidth
      )
    },
    ResizeWindow() {
      this.SeitenVerwenden.windowHeight = document.documentElement.clientWidth
      this.BrechneMax()
      this.SeitenBerechnen()

      this.SeitenVerwenden.CurrentSeite =
        this.SeitenVerwenden.currentSeiten[
          this.SeitenVerwenden.CurrentSeite.Zahl - 1
        ]
    },
    SeitenBerechnen() {
      this.SeitenVerwenden.currentSeiten = []
      const seiteErste = {
        Zahl: 1,
        Start: 1,
        Ende: this.SeitenVerwenden.seitenLängeMax - 1,
      }
      this.SeitenVerwenden.currentSeiten.push(seiteErste)
      this.SeitenAnzahl()
      for (let i = 0; i < this.SeitenVerwenden.seitenAnzahl; i++) {
        const seite = {
          Zahl: this.SeitenVerwenden.currentSeiten[i].Zahl + 1,
          Start: this.SeitenVerwenden.currentSeiten[i].Ende + 1,
          Ende:
            this.SeitenVerwenden.currentSeiten[i].Ende +
            this.SeitenVerwenden.seitenLängeMax -
            1,
        }
        this.SeitenVerwenden.currentSeiten.push(seite)
      }
    },
    SeitenAnzahl() {
      let TabellenGröße = this.TabelenGröße.breite,
        seitenAnzahl = 1
      while (TabellenGröße >= this.SeitenVerwenden.seitenLängeMax) {
        seitenAnzahl++
        let seiten = TabellenGröße - this.SeitenVerwenden.seitenLängeMax

        TabellenGröße = seiten
      }
      this.SeitenVerwenden.seitenAnzahl = seitenAnzahl - 1
    },

    //Seiten wechseln

    SeiteZurück() {
      this.SeitenVerwenden.CurrentSeite =
        this.SeitenVerwenden.currentSeiten[
          this.SeitenVerwenden.CurrentSeite.Zahl - 2
        ]
    },
    SeiteVor() {
      this.SeitenVerwenden.CurrentSeite =
        this.SeitenVerwenden.currentSeiten[
          this.SeitenVerwenden.CurrentSeite.Zahl
        ]
    },
    SeiteFirst() {
      this.SeitenVerwenden.CurrentSeite = this.SeitenVerwenden.currentSeiten[0]
    },
    SeiteLast() {
      this.SeitenVerwenden.CurrentSeite =
        this.SeitenVerwenden.currentSeiten[
          this.SeitenVerwenden.currentSeiten.length - 1
        ]
    },

    // Tabelle erstellen

    InserteNewTabellTabel(state) {
      const Tabell = new Table(state.newTabell.name, state.newTabell.data)

      state.currentTabelles.unshift(Tabell)

      state.currentTabelle.TabelName = Tabell.TabelName

      state.currentTabelle.data = Tabell.data
    },
    CreateNewTabellData(state) {
      state.newTabell.data = []
      for (let i = 1; i <= state.newTabell.zeilen; i++) {
        const zeile = []
        state.newTabell.data.push(zeile)
        for (let I = 1; I <= state.newTabell.spalten; I++) {
          zeile.push(new Zelle(""))
        }
      }
    },
    ChecknewTabellName(state) {
      state.currentTabelles.forEach((tabell) => {
        if (tabell.TabelName === state.newTabell.name) {
          state.newTabell.checkTabellName = true
        } else {
          state.newTabell.checkTabellName = false
        }
      })
    },

    // Tabelle bearbeiten

    // Zellen tauschen
    ZellenTauschenAufrufen() {
      this.TableBearbeiten.Sections.ZellenTauschen = true
      this.TableBearbeiten.Sections.SpalteTauschen = false
      this.TableBearbeiten.Sections.ZeileTauschen = false
      this.TableBearbeiten.Sections.ZeileEinfügen = false
      this.TableBearbeiten.Sections.SpalteEinfügen = false

      this.TableBearbeiten.Sections.Aside = false
    },
    ZellenTauschen() {
      let temp = ""

      const Position = {
        ErsteZelleZeile:
          this.TableBearbeiten.ZellenTauschen.ErsteZelle.Zeile - 1,

        ErsteZelleSpalte:
          this.TableBearbeiten.ZellenTauschen.ErsteZelle.Spalte - 1,

        ZweiteZelleSpalte:
          this.TableBearbeiten.ZellenTauschen.ZweiteZelle.Spalte - 1,

        ZweiteZelleZeile:
          this.TableBearbeiten.ZellenTauschen.ZweiteZelle.Zeile - 1,
      }

      // save erste zelle temp
      temp =
        this.CurrentTable.TableData[Position.ErsteZelleZeile][
          Position.ErsteZelleSpalte
        ].ZellenInhalt

      // erste zelle mit zweiter zelle ersetzen
      this.CurrentTable.TableData[Position.ErsteZelleZeile][
        Position.ErsteZelleSpalte
      ].ZellenInhalt =
        this.CurrentTable.TableData[Position.ZweiteZelleZeile][
          Position.ZweiteZelleSpalte
        ].ZellenInhalt

      // zweite zelle mit temp ersetzen
      this.CurrentTable.TableData[Position.ZweiteZelleZeile][
        Position.ZweiteZelleSpalte
      ].ZellenInhalt = temp
    },
    OpenAside() {
      if (this.TableBearbeiten.Sections.Aside) {
        this.TableBearbeiten.Sections.Aside = false
      } else {
        this.TableBearbeiten.Sections.Aside = true
      }
    },

    //Zeilen bearbeiten

    ZeilenEinfügenAufrufen() {
      this.TableBearbeiten.Sections.ZeileEinfügen = true
      this.TableBearbeiten.Sections.SpalteTauschen = false
      this.TableBearbeiten.Sections.SpalteEinfügen = false
      this.TableBearbeiten.Sections.ZeileTauschen = false
      this.TableBearbeiten.Sections.ZellenTauschen = false
      this.TableBearbeiten.Sections.Aside = false
    },

    ZeilenEinfügen() {
      this.TableBearbeiten.Error = undefined

      if (this.CheckZeile()) {
        this.CreateZeile()

        this.GetIsertIndexZeile()
        this.InsetElenemtsZeile()
        this.InitSeitenBerechnen()
      }
    },
    GetIsertIndexZeile() {
      switch (this.TableBearbeiten.Einfügen.Zeilen.Position) {
        case "Über":
          this.TableBearbeiten.ZeileTemp.InsertPositon =
            this.TableBearbeiten.Einfügen.Zeilen.Zeile - 1
          break
        case "Unter":
          this.TableBearbeiten.ZeileTemp.InsertPositon =
            this.TableBearbeiten.Einfügen.Zeilen.Zeile
          break
      }
    },
    InsetElenemtsZeile() {
      let temp = this.CurrentTableTableData,
        temp2 = new Map()

      for (
        let key = 1;
        key <= this.TableBearbeiten.ZeileTemp.InsertPositon;
        key++
      ) {
        temp2.set(key, temp.get(key))
        temp.delete(key)
      }

      for (
        let key = temp2.size + 1;
        key <= this.TableBearbeiten.Einfügen.Zeilen.Anzahl;
        key++
      ) {
        temp2.set(
          key,
          temp.get(key, this.TableBearbeiten.ZeileTemp.zeile.values)
        )
      }

      temp.forEach((value) => {


        
      })
      console.log(temp2)
    },

    CreateZeile() {
      for (let key = 1; key <= this.FirstZeileLength; key++) {
        this.TableBearbeiten.ZeileTemp.zeile.set(key, new Zelle())
      }
    },
    CheckZeile() {
      switch (true) {
        case this.TableBearbeiten.Einfügen.Zeilen.Zeile <= 0 ||
          this.TableBearbeiten.Einfügen.Zeilen.Zeile > this.TabelenGröße.höhe:
          this.TableBearbeiten.Error = "Diese Zeile ist nicht vorhanden"

          return false
        case this.TableBearbeiten.Einfügen.Zeilen.Anzahl <= 0:
          this.TableBearbeiten.Error = "Diese Anzahl ist nicht vorhanden"
          return false
        default:
          return true
      }
    },
    GetOptionZeile(e) {
      const Position = e.target.value

      this.TableBearbeiten.Einfügen.Zeilen.Position = Position
    },

    ZeilenTauschenAufrufen() {
      this.TableBearbeiten.Sections.ZeileTauschen = true
      this.TableBearbeiten.Sections.ZeileEinfügen = false
      this.TableBearbeiten.Sections.SpalteTauschen = false
      this.TableBearbeiten.Sections.SpalteEinfügen = false
      this.TableBearbeiten.Sections.ZellenTauschen = false
      this.TableBearbeiten.Sections.Aside = false
    },
    ZeilenTauschen(state) {
      let temp = []

      state.currentTabelle.data[
        state.bearbeiten.tauschen.zeilen.erste - 1
      ].forEach((item, i) => {
        temp.push(item.zellenInhalt)

        item.zellenInhalt =
          state.currentTabelle.data[
            state.bearbeiten.tauschen.zeilen.zweite - 1
          ][i].zellenInhalt

        state.currentTabelle.data[state.bearbeiten.tauschen.zeilen.zweite - 1][
          i
        ].zellenInhalt = temp[i]
      })
    },

    // Spalten bearbeiten

    GetOptionSpalte(e) {
      const { value } = e
      console.log(value)
      this.TableBearbeiten.Einfügen.Spalten.Position
    },
    SpaltenEinfügenAufrufen() {
      this.TableBearbeiten.Sections.SpalteEinfügen = true
      this.TableBearbeiten.Sections.ZeileTauschen = false
      this.TableBearbeiten.Sections.ZeileEinfügen = false
      this.TableBearbeiten.Sections.SpalteTauschen = false
      this.TableBearbeiten.Sections.ZellenTauschen = false
      this.TableBearbeiten.Sections.Aside = false
    },

    SpaltenEinfügen(state) {
      console.log(state.bearbeiten.spalten)
      const spaltenPos = state.bearbeiten.spalten.spalten - 1
      if (spaltenPos == 0 && state.bearbeiten.spalten.position == "L") {
        for (let i = 0; i < state.bearbeiten.spalten.anzahl; i++) {
          state.currentTabelle.data.forEach((zeilen, i) => {
            zeilen.unshift(new Zelle(""))
          })
        }
      } else if (
        spaltenPos == state.TabelenGröße.breite - 1 &&
        state.bearbeiten.spalten.position == "R"
      ) {
        for (let i = 0; i < state.bearbeiten.spalten.anzahl; i++) {
          state.currentTabelle.data.forEach((zeilen, i) => {
            zeilen.push(new Zelle())
          })
        }
      } else {
        Store.commit("GetIsertIndexSpalte", spaltenPos)
        for (let i = 0; i < state.bearbeiten.spalten.anzahl; i++) {
          state.currentTabelle.data.forEach((zeilen, i) => {
            zeilen.splice(
              state.bearbeiten.SpalteTemp.InsertPositon,
              0,
              new Zelle()
            )
          })
        }
      }
    },
    GetIsertIndexSpalte(state, pos) {
      if (state.bearbeiten.spalten.position == "L") {
        state.bearbeiten.SpalteTemp.InsertPositon = pos
      } else {
        state.bearbeiten.SpalteTemp.InsertPositon = pos + 1
      }
    },
    SpaltenTauschenAufrufen() {
      this.TableBearbeiten.Sections.SpalteTauschen = true
      this.TableBearbeiten.Sections.ZeileTauschen = false
      this.TableBearbeiten.Sections.ZeileEinfügen = false
      this.TableBearbeiten.Sections.SpalteEinfügen = false
      this.TableBearbeiten.Sections.ZellenTauschen = false
      this.TableBearbeiten.Sections.Aside = false
    },
    SpaltenTauschen(state) {
      let temp = []
      state.currentTabelle.data.forEach((zeile, i) => {
        temp.push(
          zeile[state.bearbeiten.tauschen.spalten.erste - 1].zellenInhalt
        )
        zeile[state.bearbeiten.tauschen.spalten.erste - 1].zellenInhalt =
          zeile[state.bearbeiten.tauschen.spalten.zweite - 1].zellenInhalt
        zeile[state.bearbeiten.tauschen.spalten.zweite - 1].zellenInhalt =
          temp[i]
      })
    },

    // Download File

    async mDownlodFile(TableIndex) {
      this.FormatData(this.CurrentTables[TableIndex].TableData)

      papa.unparse(this.DownloadFile.Data)

      this.DownloadFile.Href = `data:text/csv;charset=utf-8,${this.DownloadFile.Data}`
    },
    FormatData(data) {
      const Formatdata = []

      data.forEach((Zeile) => {
        const zeilen = []

        Formatdata.push(zeilen)

        Zeile.forEach((Zelle) => {
          zeilen.push(Zelle.zellenInhalt)
        })
      })
      this.DownloadFile.Data = Formatdata
    },
    //Tabelle Löschen

    SpalteLöschen(Index) {
      let temp,
        Temp2,
        NewKey = 0

      temp = this.CurrentTable.TableData

      for (let key = 1; key <= temp.size; key++) {
        temp.get(key).delete(Index)
      }
      Temp2 = new Map()

      temp.forEach((Zeile, ZeilenKey) => {
        Temp2.set(ZeilenKey, new Map())

        Zeile.forEach(({ ZellenInhalt, Activ }, zellenKey) => {
          NewKey++
          Temp2.get(ZeilenKey).set(NewKey, new Zelle(ZellenInhalt, Activ))
        })
        NewKey = 0
      })
      console.log(Temp2)
      this.CurrentTable.TableData = Temp2
    },
    ZeileLöschen(key) {
      let temp,
        NewKey = 0

      temp = this.CurrentTable.TableData
      temp.delete(key)
      this.CurrentTable.TableData = new Map()
      temp.forEach((zeile) => {
        NewKey++
        this.CurrentTable.TableData.set(NewKey, zeile)
      })
    },

    // Uploade File

    CreateTabel() {
      const TableData = this.CreateTableData()

      const Tabell = new Table(this.UploadeFile.fileName, TableData)
      this.CurrentTables.unshift(Tabell)

      this.CurrentTabelleID = 0
      this.CurrentTable.TableName = Tabell.TableName
      this.CurrentTable.TableData = Tabell.TableData

      console.log(this.CurrentTable)
    },

    CreateTableData() {
      const TableData = new Map()

      this.UploadeFile.data.forEach((Zeile, ZeileIndex) => {
        const zeile = new Map()

        TableData.set(ZeileIndex + 1, zeile)

        Zeile.forEach((item, ZellenIndex) => {
          zeile.set(ZellenIndex + 1, new Zelle(item.trim()))
        })
      })

      return TableData
    },

    async GetFileData(e) {
      const [File] = await e.target.files

      this.UploadeFile.fileName = await File.name.slice(0, -4)

      const content = await File.text()
      const { data } = papa.parse(content)

      this.UploadeFile.data = data

      this.CreateTabel()
    },

    // Zellen bearbeiten

    InitZelleBerarbeiten(Zeile, Spalte, Zelleninhalt) {
      const SelectetZelle = {
        Zeile,
        Spalte,
        Zelleninhalt,
      }

      this.SaveLastZelle()

      this.SetCurrentZelle(SelectetZelle)

      this.SetFocusedZelle()
    },

    SaveLastZelle() {
      this.CurrentTable.LastZelle.Zeile = this.CurrentTable.CurrentZelle.Zeile

      this.CurrentTable.LastZelle.Spalten =
        this.CurrentTable.CurrentZelle.Spalten

      this.CurrentTable.LastZelle.ZellenInhalt =
        this.CurrentTable.CurrentZelle.ZellenInhalt

      this.CurrentTable.LastZelle.Activ = this.CurrentTable.CurrentZelle.Activ
    },
    SetCurrentZelle(SelectetZelle) {
      this.CurrentTable.CurrentZelle.Zeile = SelectetZelle.Zeile

      this.CurrentTable.CurrentZelle.Spalten = SelectetZelle.Spalte

      this.CurrentTable.CurrentZelle.ZellenInhalt = SelectetZelle.Zelleninhalt
    },
    SetFocusedZelle() {
      this.CurrentTable.TableData.get(this.CurrentTable.CurrentZelle.Zeile).get(
        this.CurrentTable.CurrentZelle.Spalten
      ).Activ = true

      this.CurrentTable.TableData.get(this.CurrentTable.LastZelle.Zeile).get(
        this.CurrentTable.LastZelle.Spalten
      ).Activ = false
    },
    SetZellenValue() {
      this.CurrentTable.TableData.get(this.CurrentTable.CurrentZelle.Zeile).get(
        this.CurrentTable.CurrentZelle.Spalten
      ).ZellenInhalt = this.CurrentTable.CurrentZelle.ZellenInhalt
    },

    // selcet get set values
    SetCurrentTabelName() {
      this.CurrentTables[this.CurrentTabelleID].TableName =
        this.CurrentTable.TableName
    },
    SetTabelSize() {
      this.TabelenGröße.höhe = this.CurrentTable.TableData.size
      this.TabelenGröße.breite = this.CurrentTable.TableData.get(1).size
    },
    GetSelectTabel(TableIndex) {
      this.CurrentTabelleID = TableIndex

      this.CurrentTable = this.CurrentTables[this.CurrentTabelleID]
    },

    SetApiUrlUserTabellen(state) {
      if (localStorage.length > 0) {
        this.state.LoginBTN = false
        this.state.SingelUpBTN = false
        this.state.LogoutBTN = true
        const User = JSON.parse(localStorage.getItem("User"))

        state.ApiURLs.ApiUrlUserTabellen = `https://csvdb.onrender.com/users/${User.Username}/Tabellen`
      }
    },

    async Abmelden() {
      localStorage.clear()
    },

    //Anmelden
    async mAnmelden() {
      try {
        const res = await axios.post(
          this.ApiURLs.ApiUrlUsersAnmelden,
          this.Anmelden,
          { withCredentials: true, baseURL: "http://localhost:8080" }
        )

        if (res.status == 200) {
          this.AnmeldenCheck = res.data
        } else if (res.status == 201) {
          this.UserData = res.data
          console.log(this.UserData)
          if (this.AngemedetBleiben) {
            const DataAnmelden = JSON.stringify(this.Anmelden)
            localStorage.setItem("Csv", DataAnmelden)
            router.push({ name: "Csv" })
          } else {
            const DataAnmelden = JSON.stringify(this.Anmelden)
            sessionStorage.setItem("Csv", DataAnmelden)
            router.push({ name: "Csv" })
          }
        }
      } catch (e) {
        console.error(e.message)
      }
    },

    // Registrieren

    async mRegistrieren() {
      try {
        if (
          this.Registrieren.Passwort !== this.Registrieren.PasswortWiederholen
        ) {
          this.RegistrierenCheck = "Passwörter sind nicht die selben"
        } else {
          const { PasswordWiederholen, ...UserData } = this.Registrieren

          const res = await axios.post(
            this.ApiURLs.ApiUrlUsersRegistrieren,
            UserData
          )

          if (res.status == 202) {
            this.RegistrierenCheck = res.data
          } else if (res.status == 201) {
            router.push({ name: "Login" })
          }
        }
      } catch (e) {
        console.error(e.message)
      }
    },

    // Requests

    async GetTabels() {
      try {
        const res = await fetch(this.state.ApiURLs.ApiUrlUserTabellen, {
          mode: "cors",
        })

        this.state.currentTabelles = await res.json()

        this.state.currentTabelle.TabelName =
          this.state.currentTabelles[0].TabelName

        this.state.currentTabelle.data = this.state.currentTabelles[0].data

        this.state.currentTabelle.currentZelle =
          this.state.currentTabelles[0].currentZelle

        this.state.currentTabelle.lastZelle =
          this.state.currentTabelles[0].lastZelle
      } catch (e) {
        console.error(e.message)
      }
    },

    async SaveTabels() {
      try {
        const tabels = this.state.currentTabelles
        const json = JSON.stringify(tabels)

        const optons = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: json,
        }

        const res = await fetch(this.state.ApiURLs.ApiUrlUserTabellen, optons)
        console.log(res)
      } catch (e) {
        console.error(e.message)
      }
    },

    async Delettabel() {
      try {
        const TabelleInfo = {
          id: this.state.currentTabelleID,
        }
        const json = JSON.stringify(TabelleInfo)

        const optons = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: json,
        }

        const res = await fetch(this.state.ApiURLs.ApiUrlUserTabellen, optons)
      } catch (e) {
        console.log(e.message)
      }
    },

    async InitDelet() {
      await this.Delettabel()

      await Store.dispatch("GetTabels")
    },
  },
})
