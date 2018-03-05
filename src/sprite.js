/**
 *  sprite.js
 *
 *  Author : Hank Hsiao
 *  Version: 0.0.1
 *  Create : 2018.3.5
 *  Update : 2018.3.5
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
        repeat: -1,
        autoPlay: false
    };

    function Sprite(setting) {
        this.setting = tools.deepCopy(setting, defaultSetting);
        console.log(this.setting);
    }

    // observer.js
    Observer(Sprite.prototype);

    Sprite.prototype.init = function() {
        // preload images qty
        this.el = document.querySelector(this.setting.el);
        this.totalFrames = this.setting.imgEndIndex - this.setting.imgStartIndex + 1;
        this.currentFrame = 0;
        this.preload();
        return this;
    };

    Sprite.prototype.preload = function() {
        var self = this;
        var preloadConfig = {
            manifest: [],
            onAllLoad: function(source) {
                console.log('img all loaded');
                self.trigger('preloaded', source);
                self.source = source;
                self.create();
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

    Sprite.prototype.create = function() {
        console.log('create...');
        console.log(this.source);
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

    Sprite.prototype.controlAimation = function() {
        
        if (this.currentFrame > this.totalFrames - 1) {
            this.stop();
            console.log('好了啦');
            return;
        }

        this.ctx.clearRect(0, 0, this.setting.width, this.setting.height);

        var key = this.setting.imgName + this.currentFrame;
        // console.log(key);
        this.ctx.drawImage(this.source[key].img, 0, 0, this.setting.width, this.setting.height);
        this.currentFrame++;
    };

    Sprite.prototype.controlTimer = function() {
        var speed = 1000 / this.setting.fps;
        if (this.setting.duration !== undefined) {
            speed = this.setting.duration / this.totalFrames;
        }
        this.timer = setInterval(this.controlAimation.bind(this), speed);
    };

    Sprite.prototype.play = function() {
        console.log('play');
        this.controlTimer();
    };

    Sprite.prototype.stop = function() {
        console.log('stop');
        clearInterval(this.timer);
    };

    return Sprite;
})();
