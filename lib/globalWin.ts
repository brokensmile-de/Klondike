export class GlobalWin {
  private static instance: GlobalWin; // Singleton-Instanz
  private isWin: boolean; // Ausgewählter zufälliger Wert

  // Private Konstruktor, damit keine weiteren Instanzen erstellt werden können
  private constructor() {
    this.isWin = false;
  }

  // Methode zum Zugriff auf die Singleton-Instanz
  public static getInstance(): GlobalWin {
    if (!GlobalWin.instance) {
      GlobalWin.instance = new GlobalWin();
    }
    return GlobalWin.instance;
  }

  // Methode zur Auswahl eines zufälligen Wertes
  public setWin(value:boolean) {
    this.isWin = value;
  }

  // Methode zum Abrufen des zufälligen Wertes
  public getWin(): boolean {
    return this.isWin;
  }
}