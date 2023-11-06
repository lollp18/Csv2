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
      TableData: [
        [
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
        ],
        [
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
        ],

        [
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
          { Activ: false, ZellenInhalt: "" },
        ],
      ],
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
        zeilen: [],
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
        Start: 0,
        Ende: undefined,
      },
    },

    ApiURLs: {
      ApiUrlUsersRegistrieren: "http://localhost:8080/auth/registrieren",
      ApiUrlUsersAnmelden: "http://localhost:8080/auth/login",
      ApiUrlUserTabellen: undefined,
    },
  }),

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
        (this.SeitenVerwenden.windowHeight - 300) /
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
        Start: 0,
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
        this.CurrentTable.TableData[PositionErsteZelleZeile][
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
      this.CreateZeile()

      const zeilePos = state.bearbeiten.zeilen.zeilen - 1
      if (zeilePos == 0 && state.bearbeiten.zeilen.position == "Ü") {
        state.bearbeiten.ZeileTemp.zeilen.forEach((zeile) => {
          state.currentTabelle.data.unshift(zeile)
        })
      } else if (
        zeilePos == state.TabelenGröße.höhe - 1 &&
        state.bearbeiten.zeilen.position == "U"
      ) {
        state.bearbeiten.ZeileTemp.zeilen.forEach((zeile) => {
          state.currentTabelle.data.push(zeile)
        })
      } else {
        Store.commit("GetIsertIndexZeile", zeilePos)
        state.bearbeiten.ZeileTemp.zeilen.forEach((zeile) => {
          state.currentTabelle.data.splice(
            state.bearbeiten.ZeileTemp.InsertPositon,
            0,
            zeile
          )
        })
      }
    },

    CreateZeile() {
      for (let i = 0; i < this.TableBearbeiten.Einfügen.Zeilen.Anzahl; i++) {
        const zeile = []

        this.TableBearbeiten.ZeileTemp.zeilen.push(zeile)

        for (let i = 0; i < this.TabelenGröße.breite; i++) {
          zeile.push(new Zelle(""))
        }
      }
    },

    GetIsertIndexZeile(state, pos) {
      if (state.bearbeiten.zeilen.position == "Ü") {
        state.bearbeiten.ZeileTemp.InsertPositon = pos
      } else {
        state.bearbeiten.ZeileTemp.InsertPositon = pos + 1
      }
    },
    GetOptionZeile: (state, NewPosition) => {
      state.bearbeiten.zeilen.position = NewPosition
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
            zeilen.push(new Zelle(""))
          })
        }
      } else {
        Store.commit("GetIsertIndexSpalte", spaltenPos)
        for (let i = 0; i < state.bearbeiten.spalten.anzahl; i++) {
          state.currentTabelle.data.forEach((zeilen, i) => {
            zeilen.splice(
              state.bearbeiten.SpalteTemp.InsertPositon,
              0,
              new Zelle("")
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
      this.CurrentTable.TableData.forEach((zeile) => {
        zeile.splice(Index, 1)
      })
    },
    ZeileLöschen(Index) {
      this.CurrentTable.TableData.splice(Index, 1)
    },

    // Uploade File

    CreateTabel() {
      const data = []
      this.UploadeFile.data.forEach((zeile) => {
        const Tzeile = []
        data.push(Tzeile)
        zeile.forEach((item) => {
          Tzeile.push(new Zelle(item))
        })
      })

      const Tabell = new Table(this.UploadeFile.fileName, data)
      this.CurrentTables.unshift(Tabell)

      this.CurrentTabelleID = 0
      this.CurrentTable.TableName = Tabell.TableName
      this.CurrentTable.TableData = Tabell.TableData

      console.log(this.CurrentTable)
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
      this.CurrentTable.TableData[this.CurrentTable.CurrentZelle.Zeile][
        this.CurrentTable.CurrentZelle.Spalten
      ].Activ = true

      this.CurrentTable.TableData[this.CurrentTable.LastZelle.Zeile][
        this.CurrentTable.LastZelle.Spalten
      ].Activ = false
    },
    SetZellenValue() {
      this.CurrentTable.TableData[this.CurrentTable.CurrentZelle.Zeile][
        this.CurrentTable.CurrentZelle.Spalten
      ].ZellenInhalt = this.CurrentTable.CurrentZelle.ZellenInhalt
    },

    // selcet get set values
    SetCurrentTabelName() {
      this.CurrentTables[this.CurrentTabelleID].TableName =
        this.CurrentTable.TableName
    },
    SetTabelSize() {
      this.TabelenGröße.höhe = this.CurrentTable.TableData.length
      this.TabelenGröße.breite = this.CurrentTable.TableData[0].length
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

    // Uploade File

    HasTabels() {
      if (this.CurrentTables.length == 0) {
        this.tabelhidde = true
        this.noTabelhidde = false
      } else {
        this.tabelhidde = false
        this.noTabelhidde = true
      }
    },
    async GetFileData(e) {
      const [File] = await e.target.files
      console.log(File)
      this.UploadeFile.fileName = await File.name.slice(0, -4)

      const content = await File.text()

      const datas = papa.parse(content)

      this.UploadeFile.data = datas.data

      this.CreateTabel()
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
