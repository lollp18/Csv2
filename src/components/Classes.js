export const Table = class {
  LastZelle = {
    Zeile: 0,
    Spalten: 0,
    ZellenInhalt: "",
    Activ: false,
  }
  CurrentZelle = {
    Zeile: undefined,
    Spalten: undefined,
    ZellenInhalt: "",
    Activ: false,
  }
  constructor(TableName, TableData) {
    this.TableName = TableName
    this.TableData = TableData
  }
}

export const Zelle = class {
  Activ
  constructor(ZellenInhalt = "") {
    this.ZellenInhalt = ZellenInhalt

    this.Activ = false
  }
}
