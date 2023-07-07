var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.subscriptions = {};
    }
    EventEmitter.prototype.subscribe = function (event, callback) {
        if (!this.subscriptions[event]) {
            this.subscriptions[event] = [];
        }
        this.subscriptions[event].push(callback);
    };
    EventEmitter.prototype.unsubscribe = function (event) {
        if (this.subscriptions[event]) {
            this.subscriptions[event] = [];
        }
    };
    EventEmitter.prototype.emit = function (event, data) {
        var callbacks = this.subscriptions[event];
        if (callbacks) {
            callbacks.forEach(function (cb) { return cb(data); });
        }
    };
    return EventEmitter;
}());
var TemperatureSensor = /** @class */ (function () {
    function TemperatureSensor(eventEmitter, database) {
        this.temperature = 25;
        this.eventEmitter = eventEmitter;
        this.database = database;
        setInterval(this.updateTemperature.bind(this), 2000);
    }
    TemperatureSensor.prototype.updateTemperature = function () {
        var randomTemperature = Math.floor(Math.random() * 10) + 20;
        this.temperature = randomTemperature;
        this.eventEmitter.emit("temperature-change", this.temperature);
        this.database.saveTemperature(this.temperature);
    };
    return TemperatureSensor;
}());
var AirConditioner = /** @class */ (function () {
    function AirConditioner(eventEmitter, database) {
        this.degree = 0;
        this.eventEmitter = eventEmitter;
        this.database = database;
        this.eventEmitter.subscribe("temperature-change", this.adjustDegree.bind(this));
    }
    AirConditioner.prototype.adjustDegree = function (temperature) {
        if (temperature > 25) {
            this.degree += 1;
        }
        else if (temperature < 23) {
            this.degree -= 1;
        }
        this.eventEmitter.emit("degree-change", this.degree);
        this.database.saveDegree(this.degree);
    };
    AirConditioner.prototype.onChange = function (callback) {
        var _this = this;
        this.eventEmitter.subscribe("degree-change", callback);
        return function () { return _this.eventEmitter.unsubscribe("degree-change"); };
    };
    return AirConditioner;
}());
var Database = /** @class */ (function () {
    function Database() {
        this.temperature = 25;
        this.degree = 0;
    }
    Database.prototype.saveTemperature = function (temperature) {
        this.temperature = temperature;
        // Code to save temperature to the database
        console.log("Temperature saved to database: ".concat(temperature));
    };
    Database.prototype.saveDegree = function (degree) {
        this.degree = degree;
        // Code to save degree to the database
        console.log("Degree saved to database: ".concat(degree));
    };
    return Database;
}());
function main() {
    var eventEmitter = new EventEmitter();
    var database = new Database();
    var temperatureSensor = new TemperatureSensor(eventEmitter, database);
    var airConditioner = new AirConditioner(eventEmitter, database);
    airConditioner.onChange(function (degree) {
        return console.log("Air conditioning degree changed: ".concat(degree));
    });
}
main();
