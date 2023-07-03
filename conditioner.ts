class EventEmitter {
  private subscriptions: Record<string, Function[]> = {};

  subscribe(event: string, callback: Function) {
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
    if (!this.subscriptions[event]) {
      return;
    }
    this.subscriptions[event].forEach((cb) => cb(data));
  }
}
  
  class AirConditioner {
    private eventEmitter: EventEmitter = new EventEmitter();
    private _temperature: number = 25;
    private _degree: number = 0;
  
    constructor() {
      setInterval(() => this.adjustDegree(), 1000);
    }
  
    get temperature() {
      return this._temperature;
    }
  
    set temperature(value: number) {
      this._temperature = value;
    }
  
    get degree() {
      return this._degree;
    }
  
    set degree(value: number) {
      this._degree = value;
      this.eventEmitter.emit("degree-change", this.degree);
    }
  
    private adjustDegree() {
      if (this.temperature > 25) {
        this.degree += 1;
      } else if (this.temperature < 23) {
        this.degree -= 1;
      }
    }
  
    onChange(callback: (degree: number) => void) {
      this.eventEmitter.subscribe("degree-change", callback);
      return () => this.eventEmitter.unsubscribe("degree-change");
    }
  }
  
  function main() {
    const airConditioner = new AirConditioner();
  
    // Simulate temperature changes
    setInterval(() => {
      const randomTemperature = Math.floor(Math.random() * 10) + 20;
      airConditioner.temperature = randomTemperature;
    }, 2000);
  
    airConditioner.onChange((degree) =>
      console.log(`Air conditioning degree changed: ${degree}`)
    );
  }
  
  main();