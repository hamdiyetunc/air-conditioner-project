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
        if (!this.subscriptions[event]) {
            return;
        }
        this.subscriptions[event].forEach(function (cb) { return cb(data); });
    };
    return EventEmitter;
}());
var AirConditioner = /** @class */ (function () {
    function AirConditioner() {
        var _this = this;
        this.eventEmitter = new EventEmitter();
        this._temperature = 25;
        this._degree = 0;
        setInterval(function () { return _this.adjustDegree(); }, 1000);
    }
    Object.defineProperty(AirConditioner.prototype, "temperature", {
        get: function () {
            return this._temperature;
        },
        set: function (value) {
            this._temperature = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AirConditioner.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        set: function (value) {
            this._degree = value;
            this.eventEmitter.emit("degree-change", this.degree);
        },
        enumerable: false,
        configurable: true
    });
    AirConditioner.prototype.adjustDegree = function () {
        if (this.temperature > 25) {
            this.degree += 1;
        }
        else if (this.temperature < 23) {
            this.degree -= 1;
        }
    };
    AirConditioner.prototype.onChange = function (callback) {
        var _this = this;
        this.eventEmitter.subscribe("degree-change", callback);
        return function () { return _this.eventEmitter.unsubscribe("degree-change"); };
    };
    return AirConditioner;
}());
function main() {
    var airConditioner = new AirConditioner();
    // Simulate temperature changes
    setInterval(function () {
        var randomTemperature = Math.floor(Math.random() * 10) + 20;
        airConditioner.temperature = randomTemperature;
    }, 2000);
    airConditioner.onChange(function (degree) {
        return console.log("Air conditioning degree changed: ".concat(degree));
    });
}
main();
