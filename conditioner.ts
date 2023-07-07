type Callback = (data: unknown) => void;

class EventEmitter {
  private subscriptions: Record<string, Callback[]> = {};

  subscribe(event: string, callback: Callback) {
    if (!this.subscriptions[event]) {
      this.subscriptions[event] = [];
    }
    this.subscriptions[event].push(callback);
  }

  unsubscribe(event: string) {
    if (this.subscriptions[event]) {
      this.subscriptions[event] = [];
    }
  }

  emit(event: string, data: unknown) {
    const callbacks = this.subscriptions[event];
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }
}

class TemperatureSensor {
  private temperature: number = 25;
  private readonly eventEmitter: EventEmitter;
  private readonly database: Database;

  constructor(eventEmitter: EventEmitter, database: Database) {
    this.eventEmitter = eventEmitter;
    this.database = database;
    setInterval(this.updateTemperature.bind(this), 2000);
  }

  private updateTemperature() {
    const randomTemperature = Math.floor(Math.random() * 10) + 20;
    this.temperature = randomTemperature;
    this.eventEmitter.emit("temperature-change", this.temperature);
    this.database.saveTemperature(this.temperature);
  }
}

class AirConditioner {
  private degree: number = 0;
  private readonly eventEmitter: EventEmitter;
  private readonly database: Database;

  constructor(eventEmitter: EventEmitter, database: Database) {
    this.eventEmitter = eventEmitter;
    this.database = database;
    this.eventEmitter.subscribe("temperature-change", this.adjustDegree.bind(this));
  }

  private adjustDegree(temperature: number) {
    if (temperature > 25) {
      this.degree += 1;
    } else if (temperature < 23) {
      this.degree -= 1;
    }
    this.eventEmitter.emit("degree-change", this.degree);
    this.database.saveDegree(this.degree);
  }

  onChange(callback: Callback) {
    this.eventEmitter.subscribe("degree-change", callback);
    return () => this.eventEmitter.unsubscribe("degree-change");
  }
}

class Database {
  private temperature: number = 25;
  private degree: number = 0;

  saveTemperature(temperature: number) {
    this.temperature = temperature;
    // Code to save temperature to the database
    console.log(`Temperature saved to database: ${temperature}`);
  }

  saveDegree(degree: number) {
    this.degree = degree;
    // Code to save degree to the database
    console.log(`Degree saved to database: ${degree}`);
  }
}

function main() {
  const eventEmitter = new EventEmitter();
  const database = new Database();
  const temperatureSensor = new TemperatureSensor(eventEmitter, database);
  const airConditioner = new AirConditioner(eventEmitter, database);

  airConditioner.onChange((degree) =>
    console.log(`Air conditioning degree changed: ${degree}`)
  );
}

main();
