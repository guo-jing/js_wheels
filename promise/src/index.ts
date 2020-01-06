class P {
    constructor(fn) {
        if (typeof fn !== 'function') {
            throw new Error('parameter is not a function.');
        }
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

    successFns = [];
    failFns = [];
    promises = [];
    state = 'pending';

    resolve(arg) {
        setTimeout(() => {
            if (this.state === 'pending' && this.successFns.length > 0) {
                this.successFns.forEach((success, index) => {
                    let result;
                    try {
                        result = success.call(undefined, arg);
                    } catch(e) {
                        this.promises[index].reject(e);
                        return;
                    }
                    this.promises[index].resolveWith(result);
                });
                this.state = 'fulfilled';
            }
        });
    }

    reject(arg) {
        setTimeout(() => {
            if (this.state === 'pending' && this.failFns.length > 0) {
                this.failFns.forEach((fail, index) => {
                    let result;
                    try {
                        result = fail.call(undefined, arg);
                    } catch(e) {
                        this.promises[index].reject(e);
                        return;
                    }
                    this.promises[index].resolveWith(result);
                });
                this.state = 'rejected';
            }
        });
    }

    then(success, fail) {
        if (typeof success === 'function') this.successFns.push(success);
        if (typeof fail === 'function') this.failFns.push(fail);
        this.promises.push(new P(() => {}));
        return new P(() => {});
    }

    resolveWith(result) {

    }
}

module.exports = P;