// ref : https://github.com/component/emitter/blob/master/index.js

function Observer(obj) {
    if (obj) {
        return copy(obj);
    }
}

function copy(obj) {
    for (var key in Observer.prototype) {
        obj[key] = Observer.prototype[key];
    }
    return obj;
}

Observer.prototype.on = function(event, fn) {
    this.subscribers = this.subscribers || {};
    if (typeof this.subscribers[event] === 'undefined') {
        this.subscribers[event] = [];
    }
    this.subscribers[event].push(fn);

    return this;
}

Observer.prototype.off = function(event, fn) {
    this.subscribers = this.subscribers || {};
    
    // condition 1: no arguments
    // remove all event
    if (arguments.length === 0) {
        this.subscribers = {};
        return this;
    }


    // find specific event
    var callbacks = this.subscribers[event];
    if (!callbacks) return this;

    // condition 2: 1 arguments
    // remove specific event and  handler
    if (arguments.length === 1) {
        delete this.subscribers[event];
        return this;
    }

    // condition 3: 2 arguments
    // remove 1 specific handler of event
    var cb;
    for (var i = callbacks.length - 1; i >= 0; i--) {
        cb = callbacks[i];
        if (cb === fn) {
            callbacks.splice(i, 1);
            break;
        }
    }

    return this;
}

/**
 * Trigger `event` with given args.
 * @param  {String} event
 * @param  {Any} optional args
 * @return {Observer}
 */
Observer.prototype.trigger = function(event) {
    this.subscribers = this.subscribers || {};
    var args = [].slice.call(arguments, 1);
    var callbacks = this.subscribers[event];
    if (callbacks) {
        callbacks.forEach(function(func) {
            func.apply(this, args);
        }, this);
    }
    return this;
}


/**
 * Return array of callbacks for `event`.
 * @param {String} event
 * @return {Array}
 */
Observer.prototype.listeners = function(event) {
    this.subscribers = this.subscribers || {};
    return this.subscribers[event] || [];
}

/**
 * Check if this emitter has `event` handlers.
 * @param {String} event
 * @return {Boolean}
 */
Observer.prototype.hasListeners = function(event) {
    return !!this.listeners(event).length;
}