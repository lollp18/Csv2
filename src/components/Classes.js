export const Zelle = class {
  Activ = false
  constructor(ZellenInhalt = "") {
    this.ZellenInhalt = ZellenInhalt.trim()
  }
}

export const Table = class {
  LastZelle = {
    Zeile: 0,
    Spalte: 0,
    ZellenInhalt: "",
    Activ: false,
  }
  CurrentZelle = {
    Zeile: undefined,
    Spalte: undefined,
    ZellenInhalt: "",
    Activ: false,
  }
  TableName
  TableData
  constructor(TableName) {
    this.TableName = TableName
    this.TableData = new Map()
  }
  static PrepareTableToStore(SendTables) {
    const CurrentTables = []

    SendTables.forEach(({ TableName, TableData, LastZelle, CurrentZelle }) => {
      const CurrentTable = new Table(TableName)
      CurrentTable.TableDataToMap(TableData)
      CurrentTable.SetLastUndCurrentZelle(LastZelle, CurrentZelle)
      CurrentTables.push(CurrentTable)
    })
    return CurrentTables
  }
  static PrepareTableToSend(CurrentTables) {
    const SendTables = []
    CurrentTables.forEach(
      ({ TableName, TableData, LastZelle, CurrentZelle }) => {
        const SendTable = new Table(TableName)
        SendTable.TableDataToArray(TableData)
        SendTable.SetLastUndCurrentZelle(LastZelle, CurrentZelle)
        SendTables.push(SendTable)
      }
    )
    return SendTables
  }

  SetLastUndCurrentZelle(LastZelle, CurrentZelle) {
    this.LastZelle = LastZelle
    this.CurrentZelle = CurrentZelle
  }

  CreateTableData(NewTableData) {
    NewTableData.forEach((Zeile, ZeileIndex) => {
      const NewZeile = new Map()
      this.TableData.set(ZeileIndex + 1, NewZeile)
      Zeile.forEach((ZelleValue, ZelleIndex) => {
        NewZeile.set(ZelleIndex + 1, new Zelle(ZelleValue))
      })
    })
  }
  GenerateTableData(AnzahlZeilen, AnzahlSpalten) {
    const Zeile = Array(Number(AnzahlZeilen)).fill("")

    const NewTableData = Array(Number(AnzahlSpalten)).fill(Zeile)
    this.CreateTableData(NewTableData)
  }

  TableDataToMap(TableData) {
    TableData.forEach((Zeile, ZeileIndex) => {
      const NewZeile = new Map()
      this.TableData.set(ZeileIndex + 1, NewZeile)
      Zeile.forEach((Zelle, ZelleIndex) => {
        NewZeile.set(ZelleIndex + 1, Zelle)
      })
    })
  }

  TableDataToArray(TableData) {
    this.TableData = []
    TableData.forEach((Zeile) => {
      this.TableData.push(Array.from(Zeile).map(([name, value]) => value))
    })
  }
}
