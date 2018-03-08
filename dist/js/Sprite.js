/**
 *  preloader.js
 *
 *  Author : Hank Hsiao
 *  Version: 1.0.1
 *  Create : 2015.8.18
 *  Update : 2017.06.01
 *  License: MIT
 */

var preloader = function(option) {
    var queue = {}; //儲存載完的檔案
    var settings = {
        manifest: [],
        onEachLoad: function(info) { console.log('[Preloader] image:' + info.index + ' loaded');},
        onAllLoad: function(queue) { console.log('[Preloader] all images loaded:' + queue);}
    };

    // 模擬 option extend settings (淺拷貝)
    var k;
    for (k in settings) {
        if (option[k]) { settings[k] = option[k]; }
    }

    var imgQty = settings.manifest.length; //圖片數量(未載入)
    var loadedImgQty = 0; //已經載入完成的圖片數量
    var img;
    var i;

    function onLoad(index, id, e) {
        var image = this;
        loadedImgQty++;
        var imgInfo = {
            id: id,
            index: loadedImgQty,
            img: image,
            total: imgQty
        };
        settings.onEachLoad(imgInfo);
        queue[id] = imgInfo;
        //如果已載入的圖片數量等於圖片總數，表全部載入完成
        if (loadedImgQty == imgQty) {
            settings.onAllLoad(queue);
        }
    }

    function onError(index, id, e) {
        var image = this;
        console.error('[Preloader] not found src = ' + this.src);
    }

    for (i = 0; i < imgQty; i += 1) {
        img = new Image();
        // console.log(img.complete);
        img.addEventListener('load', onLoad.bind(img, i, settings.manifest[i].id), false);
        img.addEventListener('error', onError.bind(img, i, settings.manifest[i].id), false);
        img.src = settings.manifest[i].src;
    }
}
// ref : https://github.com/component/emitter/blob/master/index.js

function Observer(obj) {
    if (obj) {
        return Observer.copy(obj);
    }
}

Observer.copy = function(obj) {
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
/**
 *  sprite.js
 *
 *  Author : Hank Hsiao
 *  Version: 0.0.5
 *  Create : 2018.3.5
 *  Update : 2018.3.8
 *  License: MIT
 */

var Sprite = (function() {
    var defaultSetting = {
        fps: 12,
        width: 0,
        height: 0,
        imgBaseUrl: '',
        imgName: 'img',
        imgType: '.jpg',
        imgStartIndex: 0,
        imgEndIndex: 0,
        repeat: 0,
        autoPlay: true
    };

    /**
     * deepCopy
     * @param  Function Parent
     * @param  Function Child
     */
    var deepCopy = function(p, c) {
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                deepCopy(p[i], c[i]);
            } else {
                // 淺拷貝
                c[i] = p[i];
            }
        }
        c.uber = p;
        return c;
    };

    function Sprite(setting) {
        this.setting = deepCopy(setting, defaultSetting);
    }

    // observer.js
    Observer(Sprite.prototype);

    Sprite.prototype.init = function() {
        // preload images qty
        this.el = document.querySelector(this.setting.el);
        this.totalFrames = this.setting.imgEndIndex - this.setting.imgStartIndex + 1;
        this.currentFrame = 0;
        this.currentRepeat = 0;
        this.isPlaying = false;
        this._preload();
        return this;
    };

    Sprite.prototype._preload = function() {
        var self = this;
        var preloadConfig = {
            manifest: [],
            onEachLoad: function(info) {},
            onAllLoad: function(source) {
                self.trigger('load', source);
                self.source = source;
                self._create();
            }
        };
    
        for (var i = 0; i < this.totalFrames; i++) {
            preloadConfig.manifest.push({
                id: this.setting.imgName + (this.setting.imgStartIndex + i),
                src: this.setting.imgBaseUrl + this.setting.imgName + (this.setting.imgStartIndex + i) + this.setting.imgType
            })
        }

        preloader(preloadConfig);
    };

    Sprite.prototype._create = function() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.width = this.setting.width;
        this.canvas.height = this.setting.height;
        this.el.appendChild(this.canvas);
        if (this.setting.autoPlay) {
            this.play();
        }
    };

    Sprite.prototype._controlAnimation = function() {
        if (this.currentFrame < this.totalFrames - 1) {
            this.ctx.clearRect(0, 0, this.setting.width, this.setting.height);
            var key = this.setting.imgName + this.currentFrame;
            this.ctx.drawImage(this.source[key].img, 0, 0, this.setting.width, this.setting.height);
            this.currentFrame++;
        } else {
            if (this.currentRepeat <= this.setting.repeat || this.setting.repeat === -1 ) {
                this.currentFrame = 0
                this.currentRepeat++;
            } else {
                this.stop();
            }    
        }
    }

    Sprite.prototype._controlTimer = function() {
        var speed = 1000 / this.setting.fps;
        if (this.setting.duration !== undefined) {
            speed = this.setting.duration / this.totalFrames;
        }
        this.timer = setInterval(this._controlAnimation.bind(this), speed);
    };

    Sprite.prototype.play = function() {
        if (this.isPlaying) {
            clearInterval(this.timer);  
        }
        this.trigger('play');
        this.currentFrame = 0;
        this.currentRepeat = 1;
        this.isPlaying = true;
        this._controlTimer();
        return this;
    };

    Sprite.prototype.resume = function() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.trigger('resume');
            this._controlTimer();
        }
        return this;
    };

    Sprite.prototype.stop = function() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.trigger('stop');
            clearInterval(this.timer);    
        }
        return this;
    };

    return Sprite;
})();