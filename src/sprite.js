/**
 *  sprite.js
 *
 *  Author : Hank Hsiao
 *  Version: 0.0.9
 *  Create : 2018.3.5
 *  Update : 2018.3.20
 *  License: MIT
 */

var Sprite = (function() {
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
        this.setting = deepCopy(setting, defaultSetting);
    }

    // observer.js
    Observer(Sprite.prototype);

    Sprite.prototype.init = function() {
        // preload images qty
        this.el = this.setting.el && document.querySelector(this.setting.el);
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
                self._create();
                self.source = source;
                self.trigger('load', source);
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
        // this.canvas.style.display = 'block';
        // this.canvas.style.width = '100%';
        this.canvas.width = this.setting.width;
        this.canvas.height = this.setting.height;
        
        if (this.setting.el !== undefined) {
            this.el.appendChild(this.canvas);
            this.trigger('mounted');
            if (this.setting.autoPlay) {
                this.play();
            }
        }     
    };

    Sprite.prototype._controlAnimation = function() {
        this.ctx.clearRect(0, 0, this.setting.width, this.setting.height);
        var key = this.setting.imgName + (this.currentFrame + this.setting.imgStartIndex);
        this.ctx.drawImage(this.source[key].img, 0, 0, this.setting.width, this.setting.height);        
        this.currentFrame++;

        if (this.currentFrame >= this.totalFrames) {
            if (this.setting.repeat !== 0 && (this.currentRepeat <= this.setting.repeat || this.setting.repeat === -1)) {
                this.currentFrame = 0;
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

    /**
     * mount must be run after load event
     * @param  {HTMLElement} dom
     * @return {Sprite}
     */
    Sprite.prototype.mount = function(dom) {
        this.el = dom;
        this.el.appendChild(this.canvas);
        this.trigger('mounted');
        if (this.setting.autoPlay) {
            this.play();
        }
        return this;
    };

    return Sprite;
})();