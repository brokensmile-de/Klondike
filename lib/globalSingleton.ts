export class RandomValueSingleton {
  private static instance: RandomValueSingleton; // Singleton-Instanz
  private randomValue: string | null = null; // Ausgewählter zufälliger Wert

  // Private Konstruktor, damit keine weiteren Instanzen erstellt werden können
  private constructor(private values: string[]) {
    this.selectRandomValue(); // Zufälligen Wert beim Erstellen auswählen
  }

  // Methode zum Zugriff auf die Singleton-Instanz
  public static getInstance(values: string[]): RandomValueSingleton {
    if (!RandomValueSingleton.instance) {
      RandomValueSingleton.instance = new RandomValueSingleton(values);
    }
    return RandomValueSingleton.instance;
  }

  // Methode zur Auswahl eines zufälligen Wertes
  private selectRandomValue() {
    const randomIndex = Math.floor(Math.random() * this.values.length);
    this.randomValue = this.values[randomIndex];
  }

  // Methode zum Abrufen des zufälligen Wertes
  public getRandomValue(): string | null {
    return this.randomValue;
  }
}