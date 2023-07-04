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
    function TemperatureSensor(eventEmitter) {
        this.temperature = 25;
        this.eventEmitter = eventEmitter;
        setInterval(this.updateTemperature.bind(this), 2000);
    }
    TemperatureSensor.prototype.updateTemperature = function () {
        var randomTemperature = Math.floor(Math.random() * 10) + 20;
        this.temperature = randomTemperature;
        this.eventEmitter.emit("temperature-change", this.temperature);
    };
    return TemperatureSensor;
}());
var AirConditioner = /** @class */ (function () {
    function AirConditioner(eventEmitter) {
        this.degree = 0;
        this.eventEmitter = eventEmitter;
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
    };
    AirConditioner.prototype.onChange = function (callback) {
        var _this = this;
        this.eventEmitter.subscribe("degree-change", callback);
        return function () { return _this.eventEmitter.unsubscribe("degree-change"); };
    };
    return AirConditioner;
}());
function main() {
    var eventEmitter = new EventEmitter();
    var temperatureSensor = new TemperatureSensor(eventEmitter);
    var airConditioner = new AirConditioner(eventEmitter);
    airConditioner.onChange(function (degree) {
        return console.log("Air conditioning degree changed: ".concat(degree));
    });
}
main();
