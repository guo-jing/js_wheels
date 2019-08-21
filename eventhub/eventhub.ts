class Eventhub {
    private cache = {};

    on(eventName, fn) {
        if (this.cache[eventName] === undefined) {
            this.cache[eventName] = [];
        }
        this.cache[eventName].push(fn);
    }

    emit(eventName, params?) {
        if (this.cache[eventName] === undefined) {
            return;
        }
        this.cache[eventName].forEach((fn) => {
            fn(params);
        })
    }

    off(eventName) {
        if (this.cache[eventName] === undefined) {
            return;
        }
        delete this.cache[eventName];
    }
}
export default Eventhub;