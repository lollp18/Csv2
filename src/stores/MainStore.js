import { defineStore } from "pinia"
import axios from "axios"
import router from "../router/index.js"
import { Table, Zelle } from "../components/Classes.js"
import { nextTick } from "vue"
import papa from "papaparse"
export const UseMainStore = defineStore("csv", {
  state: () => ({
    UserData: undefined,

    CurrentTable: undefined,

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
          Position: "Über",
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
        zeile: [],
        InsertPositon: undefined,
      },
      SpalteTemp: {
        spalten: [],
        InsertPositon: undefined,
      },
    },

    // Neue Tabelle erstellen
    NewTableIsOpen: false,
    NewTable: {
      Error: undefined,
      TableName: "",
      AnzahlZeilen: undefined,
      AnzahlSpalten: undefined,
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
      Email: "Lorenzo123696@gmail.com",
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
      ApiUrlUserTablen: undefined,
      ApiUrlDeletTable: undefined,
      requestOptions: {
        withCredentials: true,
        baseURL: "http://localhost:8080",
      },
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
    CurrentTablesLength: (state) => state,
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

    //Create new Table

    CreateNewTable() {
      const { AnzahlSpalten, AnzahlZeilen, TableName } = this.NewTable

      if (this.CheckNewTable()) {
        const NewTable = new Table(TableName)
        NewTable.GenerateTableData(AnzahlZeilen, AnzahlSpalten)
        this.CurrentTables.push(NewTable)
        this.GetSelectTabel(this.CurrentTables.length - 1)
        this.NewTableIsOpen = false
      }
    },
    CheckNewTable() {
      const { AnzahlSpalten, AnzahlZeilen } = this.NewTable
      let CheckOk = false

      const CheckNewTableName = this.CurrentTables.some(
        (Table) => Table.TableName == this.NewTable.TableName
      )
      const CheckSpalte = AnzahlSpalten <= 0
      const CheckZeilen = AnzahlZeilen <= 0
      CheckNewTableName
        ? (this.NewTable.Error = "Diesen Name ist Vergeben")
        : CheckSpalte
        ? (this.NewTable.Error = "Spalten anzahl zu Klein")
        : CheckZeilen
        ? (this.NewTable.Error = "Zeilen anzahl zu Klein")
        : (CheckOk = true)

      return CheckOk
    },
    // Tabelle bearbeiten

    // Zellen tauschen
    ZellenTauschenAufrufen() {
      this.SetAllSectonsFalse()
      this.TableBearbeiten.Sections.ZellenTauschen = true
    },
    CheckZellenTauschen() {
      const { ErsteZelle, ZweiteZelle } = this.TableBearbeiten.ZellenTauschen
      const { höhe, breite } = this.TabelenGröße
      let error = ""

      const sindZellenVorhanden =
        ErsteZelle.Spalte >= 1 &&
        ErsteZelle.Zeile >= 1 &&
        ZweiteZelle.Spalte >= 1 &&
        ZweiteZelle.Zeile >= 1

      const sindZellenInTabelle =
        ErsteZelle.Spalte <= höhe &&
        ErsteZelle.Zeile <= höhe &&
        ZweiteZelle.Spalte <= breite &&
        ZweiteZelle.Zeile <= breite

      const sindZellenVerschieden =
        ErsteZelle.Spalte !== ZweiteZelle.Spalte ||
        ErsteZelle.Zeile !== ZweiteZelle.Zeile

      if (!sindZellenVorhanden) {
        error = "Diese Zelle ist nicht vorhanden"
      } else if (!sindZellenInTabelle) {
        error = "Diese Zelle befindet sich nicht in der Tabelle"
      } else if (!sindZellenVerschieden) {
        error = "Diese Zellen sind identisch"
      }

      this.TableBearbeiten.Error = error

      return sindZellenVorhanden && sindZellenInTabelle && sindZellenVerschieden
    },

    ZellenTauschen() {
      if (this.CheckZellenTauschen()) {
        this.InitZeilenTauschen()
      }
    },
    InitZellenTauschen() {
      const { ErsteZelle, ZweiteZelle } = this.TableBearbeiten.ZellenTauschen
      let temp = ""

      const ZellenInaltErste = this.CurrentTableTableData.get(
        ErsteZelle.Zeile
      ).get(ErsteZelle.Spalte).ZellenInhalt

      const ZellenInaltZweite = this.CurrentTableTableData.get(
        ZweiteZelle.Zeile
      ).get(ZweiteZelle.Spalte).ZellenInhalt

      temp = ZellenInaltErste

      this.CurrentTable.TableData.get(ErsteZelle.Zeile).get(
        ErsteZelle.Spalte
      ).ZellenInhalt = ZellenInaltZweite

      this.CurrentTable.TableData.get(ZweiteZelle.Zeile).get(
        ZweiteZelle.Spalte
      ).ZellenInhalt = temp
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
      this.SetAllSectonsFalse()
      this.TableBearbeiten.Sections.ZeileEinfügen = true
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
      const { Zeile, Position } = this.TableBearbeiten.Einfügen.Zeilen
      switch (Position) {
        case "Über":
          this.TableBearbeiten.ZeileTemp.InsertPositon = Zeile - 1
          break
        case "Unter":
          this.TableBearbeiten.ZeileTemp.InsertPositon = Zeile
          break
      }
    },
    InsetElenemtsZeile() {
      let temp = this.CurrentTableTableData,
        temp2 = new Map()

      temp.forEach((Zellen, ZeilenKey) => {
        if (ZeilenKey <= this.TableBearbeiten.ZeileTemp.InsertPositon) {
          temp2.set(ZeilenKey, Zellen)
          temp.delete(ZeilenKey)
        }
      })

      this.TableBearbeiten.ZeileTemp.zeile.forEach((Zellen) => {
        temp2.set(temp2.size + 1, Zellen)
      })

      temp.forEach((Zellen) => {
        temp2.set(temp2.size + 1, Zellen)
      })

      this.CurrentTable.TableData = temp2
    },

    CreateZeile() {
      const ZeileTemp = new Map()
      this.TableBearbeiten.ZeileTemp.zeile = []
      for (let key = 1; key <= this.FirstZeileLength; key++) {
        ZeileTemp.set(key, new Zelle())
      }

      for (
        let index = 1;
        index <= this.TableBearbeiten.Einfügen.Zeilen.Anzahl;
        index++
      ) {
        this.TableBearbeiten.ZeileTemp.zeile.push(ZeileTemp)
      }
    },
    CheckZeile() {
      const { Zeile, Anzahl } = this.TableBearbeiten.Einfügen.Zeilen
      const { höhe } = this.TabelenGröße

      switch (true) {
        case Zeile <= 0 || Zeile > höhe:
          this.TableBearbeiten.Error = "Diese Zeile ist nicht vorhanden"

          return false
        case Anzahl <= 0:
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
      this.SetAllSectonsFalse()
      this.TableBearbeiten.Sections.ZeileTauschen = true
    },

    CheckZeilenTauschen() {
      const { Erste, Zweite } = this.TableBearbeiten.Tauschen.Zeilen
      const { höhe } = this.TabelenGröße

      switch (true) {
        case Erste <= 0 || Zweite <= 0:
          this.TableBearbeiten.Error = "Diese Zeile ist nicht vorhanden"

          return false
        case Erste > höhe || Zweite > höhe:
          this.TableBearbeiten.Error = "Diese Zeile ist nicht vorhanden"

          return false
        case Erste === Zweite:
          this.TableBearbeiten.Error =
            "Diese Zeilen Können nicht getauscht werden"

          return false
        default:
          return true
      }
    },

    ZeilenTauschen() {
      if (this.CheckZeilenTauschen()) {
        this.InitZeilenTauschen()
      }
    },
    InitZeilenTauschen() {
      let temp
      const { Erste, Zweite } = this.TableBearbeiten.Tauschen.Zeilen
      const ZweiteZeile = this.CurrentTableTableData.get(Zweite)
      temp = this.CurrentTableTableData.get(Erste)

      this.CurrentTable.TableData.set(Erste, ZweiteZeile)
      this.CurrentTable.TableData.set(Zweite, temp)
    },
    // Spalten bearbeiten

    GetOptionSpalte(e) {
      const Pos = e.target.value

      this.TableBearbeiten.Einfügen.Spalten.Position = Pos
    },
    SpaltenEinfügenAufrufen() {
      this.SetAllSectonsFalse()
      this.TableBearbeiten.Sections.SpalteEinfügen = true
    },

    SpaltenEinfügen() {
      if (this.CheckSpalte()) {
        this.GetIsertIndexSpalte()
        this.InsetElenemtsSpalte()
      }
    },
    CheckSpalte() {
      const { Spalte, Anzahl } = this.TableBearbeiten.Einfügen.Spalten

      switch (true) {
        case Spalte <= 0 || Spalte > this.TabelenGröße.breite:
          this.TableBearbeiten.Error = "Diese Spalte ist nicht vorhanden"

          return false
        case Anzahl <= 0:
          this.TableBearbeiten.Error = "Diese Spalte ist nicht vorhanden"
          return false
        default:
          return true
      }
    },

    InsetElenemtsSpalte() {
      let temp,
        temp2 = new Map(),
        ZeileKey = 1
      const { Spalte, Anzahl } = this.TableBearbeiten.Einfügen.Spalten
      temp = this.CurrentTable.TableData

      for (let key of this.range(this.TabelenGröße.höhe)) {
        temp2.set(key, new Map())
      }

      temp.forEach((Zellen, ZeilenKey) => {
        Zellen.forEach((Zelle, Zellenkey) => {
          if (Zellenkey <= this.TableBearbeiten.SpalteTemp.InsertPositon) {
            temp2.get(ZeilenKey).set(Zellenkey, Zelle)
            temp.get(ZeilenKey).delete(Zellenkey)
          }
        })
      })

      for (const iterator of this.range(Anzahl)) {
        temp2.forEach((Zellen, ZeilenKey) => {
          Zellen.set(Zellen.size + 1, new Zelle())
        })
      }

      temp.forEach((Zellen, ZeilenKey) => {
        Zellen.forEach((Zelle, Zellenkey) => {
          let Size = temp2.get(ZeilenKey).size
          temp2.get(ZeilenKey).set(Size + 1, Zelle)
        })
      })

      this.CurrentTable.TableData = temp2
    },
    GetIsertIndexSpalte() {
      const { Position, Spalte } = this.TableBearbeiten.Einfügen.Spalten

      switch (Position) {
        case "L":
          this.TableBearbeiten.SpalteTemp.InsertPositon = Spalte - 1
          break
        case "R":
          this.TableBearbeiten.SpalteTemp.InsertPositon = Spalte
          break
      }
    },
    SpaltenTauschenAufrufen() {
      this.SetAllSectonsFalse()
      this.TableBearbeiten.Sections.SpalteTauschen = true
    },
    CheckSpalteTauschen() {
      const { Erste, Zweite } = this.TableBearbeiten.Tauschen.Spalten
      const { breite } = this.TabelenGröße

      switch (true) {
        case Erste <= 0 || Zweite <= 0:
          this.TableBearbeiten.Error = "Diese Spalte ist nicht vorhanden"

          return false
        case Erste > breite || Zweite > breite:
          this.TableBearbeiten.Error = "Diese Spalte ist nicht vorhanden"

          return false
        case Erste === Zweite:
          this.TableBearbeiten.Error =
            "Diese Spalte Können nicht getauscht werden"

          return false
        default:
          return true
      }
    },
    SpaltenTauschen() {
      if (this.CheckSpalteTauschen()) {
        this.InitSpaltenTauschen()
      }
    },
    InitSpaltenTauschen() {
      const { Erste, Zweite } = this.TableBearbeiten.Tauschen.Spalten
      let temp = new Map()

      for (let key of this.range(this.TabelenGröße.höhe)) {
        temp.set(key, new Map())
      }

      this.CurrentTableTableData.forEach((Zeile, ZeilenKey) => {
        Zeile.forEach((Zelle, ZellenKey) => {
          if (ZellenKey === Erste) {
            temp.get(ZeilenKey).set(ZellenKey, Zelle)
          }
        })
      })

      this.CurrentTableTableData.forEach((Zeile, ZeilenKey) => {
        Zeile.forEach((Zelle, ZellenKey) => {
          if (ZellenKey === Zweite) {
            this.CurrentTable.TableData.get(ZeilenKey).set(Erste, Zelle)
          }
        })
      })

      temp.forEach((Zeile, ZeilenKey) => {
        Zeile.forEach((Zelle, ZellenKey) => {
          this.CurrentTable.TableData.get(ZeilenKey).set(Zweite, Zelle)
        })
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

    CreateTable(FileName, FileData) {
      const NewTable = new Table(FileName)
      NewTable.CreateTableData(FileData)

      this.CurrentTables.push(NewTable)
      this.GetSelectTabel(this.CurrentTables.length - 1)
    },

    async GetFileData(e) {
      const [File] = await e.target.files

      const FileName = await File.name.slice(0, -4)

      const content = await File.text()
      const { data } = papa.parse(content)

      this.CreateTable(FileName, data)
    },

    // Zellen bearbeiten

    InitZelleBerarbeiten(Zeile, Spalte, Zelleninhalt) {
      console.log(Zeile, Spalte, Zelleninhalt)
      this.SaveLastZelle()

      this.SetCurrentZelle(Zeile, Spalte, Zelleninhalt)

      this.SetFocusedZelle()
    },

    SaveLastZelle() {
      this.CurrentTable.LastZelle.Zeile = this.CurrentTable.CurrentZelle.Zeile

      this.CurrentTable.LastZelle.Spalte = this.CurrentTable.CurrentZelle.Spalte

      this.CurrentTable.LastZelle.ZellenInhalt =
        this.CurrentTable.CurrentZelle.ZellenInhalt

      this.CurrentTable.LastZelle.Activ = this.CurrentTable.CurrentZelle.Activ
    },
    SetCurrentZelle(Zeile, Spalte, Zelleninhalt) {
      this.CurrentTable.CurrentZelle.Zeile = Zeile

      this.CurrentTable.CurrentZelle.Spalte = Spalte

      this.CurrentTable.CurrentZelle.ZellenInhalt = Zelleninhalt
    },
    SetFocusedZelle() {
      this.CurrentTable.TableData.get(this.CurrentTable.CurrentZelle.Zeile).get(
        this.CurrentTable.CurrentZelle.Spalte
      ).Activ = true

      this.CurrentTable.TableData.get(this.CurrentTable.LastZelle.Zeile).get(
        this.CurrentTable.LastZelle.Spalte
      ).Activ = false
    },
    SetZellenValue() {
      this.CurrentTable.TableData.get(this.CurrentTable.CurrentZelle.Zeile).get(
        this.CurrentTable.CurrentZelle.Spalte
      ).ZellenInhalt = this.CurrentTable.CurrentZelle.ZellenInhalt
    },

    // selcet get set values
    range(end, start = 1, step = 1) {
      const result = []

      if (step === 0) {
        throw new Error("Schrittweite darf nicht 0 sein.")
      }

      if (start < end) {
        for (let i = start; i <= end; i += step) {
          result.push(i)
        }
      } else {
        for (let i = start; i >= end; i += step) {
          result.push(i)
        }
      }

      return result
    },
    SetAllSectonsFalse() {
      this.TableBearbeiten.Sections.ZeileEinfügen = false
      this.TableBearbeiten.Sections.SpalteTauschen = false
      this.TableBearbeiten.Sections.SpalteEinfügen = false
      this.TableBearbeiten.Sections.ZeileTauschen = false
      this.TableBearbeiten.Sections.ZellenTauschen = false
      this.TableBearbeiten.Sections.Aside = false
      this.TableBearbeiten.Error = undefined
    },

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

      this.CurrentTable = this.CurrentTables[TableIndex]
    },

    async SetApiUrlUserTables() {
      this.ApiURLs.ApiUrlUserTablen = `http://localhost:8080/user/${this.UserData._id}/tables`
      this.ApiURLs.ApiUrlDeletTable = `http://localhost:8080/user/${this.UserData._id}/tables/`
    },

    async Abmelden() {
      localStorage.clear()
    },
    async CheckLogin() {
      if (sessionStorage.length >= 1) {
        const AnmeldeData = await JSON.parse(sessionStorage.getItem("Csv"))
        this.Anmelden = AnmeldeData
        await this.mAnmelden()
      } else if (localStorage.length >= 1) {
        const AnmeldeData = await JSON.parse(localStorage.getItem("Csv"))
        this.Anmelden = AnmeldeData
        this.AngemedetBleiben = true
        await this.mAnmelden()
      }
    },
    //Anmelden
    async mAnmelden() {
      try {
        const res = await axios.post(
          this.ApiURLs.ApiUrlUsersAnmelden,
          this.Anmelden,
          this.ApiURLs.requestOptions
        )

        if (res.status == 202) {
          this.AnmeldenCheck = res.data
        } else if (res.status == 201) {
          this.UserData = {
            Username: res.data.Username,
            _id: res.data._id,
          }

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
        const res = await axios.get(
          this.ApiURLs.ApiUrlUserTablen,
          this.ApiURLs.requestOptions
        )
        let SendTables = await res.data

        this.CurrentTables = Table.PrepareTableToStore(SendTables)
        this.GetSelectTabel(0)
      } catch (e) {
        console.error(e.message)
      }
    },

    async SaveTabels() {
      try {
        const SendTables = Table.PrepareTableToSend(this.CurrentTables)

        const res = await axios.patch(
          this.ApiURLs.ApiUrlUserTablen,
          {
            CurrentTables: SendTables,
          },
          this.ApiURLs.requestOptions
        )
        console.log(res)
        return res.statusText
      } catch (e) {
        console.error(e.message)
      }
    },

    async DeletTable(TableID) {
      try {
        const res = await axios.delete(
          this.ApiURLs.ApiUrlDeletTable + TableID,
          this.ApiURLs.requestOptions
        )
        if (res.status == 200) {
          await this.GetTabels()
        }
      } catch (e) {
        console.log(e.message)
      }
    },
  },
})
