/**
 *  tools.js
 *
 *  Author : Hank Hsiao
 *  Version: 1.1.0
 *  Create : 2015.10.21
 *  Update : 2017.12.14
 *  License: MIT
 */
var tools = (function(window) {
    /**
     * 取得 URL 所有參數
     * @return {Object}      網址參數
     */
    var getUrlVars = function() {
        var vars = {}, hash;
        var hashes = window.location.search.slice(window.location.search.indexOf('?') + 1).split('&'); //改這寫法才不會取到#
        for (var i = 0, len = hashes.length; i < len; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = hash[1];
        }
        return vars;
    };

    /**
     * 取得 URL 指定參數的值
     * @param  {String} name 網址參數 name
     * @return {String}      網址參數 value
     */
    var getUrlVar = function(name) {
        return getUrlVars()[name];
    };

    /**
     * 產生區間內的亂數
     * @param  {Number} min 最小值
     * @param  {Number} max 最大值
     * @return {Number}     返回 min <= n >= max 的整數
     */
    var random = function(min, max) {
        return ((Math.random() * (max - min + 1)) | 0) + min;
    };

    /**
     * 隨機打亂陣列中的順序1 (似乎是3種最好的方法，有亂又不太花時間)
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    var shuffle = function(arr) {
        var tempArray = arr;
        var len = arr.length;
        var rnd;
        for (var i = 0; i < len; i++) {
            rnd = random(0, len - 1);
            swap(tempArray, i, rnd);
        }
        return tempArray;
    };

    /**
     * 隨機打亂陣列中的順序2 (較亂 但陣列越長花的時間越久)
     * @param  Array arr 要打亂的陣列
     * @return Array     打亂的陣列
     */
    var shuffle2 = function(arr) {
        var len = arr.length;
        var rnd;
        var tempArray = [];
        var randomArray = [];
        function saveRandomNumber() {
            var loopFlag = true;
            while (loopFlag) {
                rnd = random(0, len - 1);
                if (tempArray.indexOf(rnd) == -1) {
                    tempArray.push(rnd);
                    loopFlag = false;
                }
            }
        }
        for (var i = 0; i < len; i++) {
            saveRandomNumber();
            randomArray.push(arr[tempArray[i]]);
        }
        return randomArray;
    };

    /**
     * 隨機打亂陣列中的順序3 (陣列越長會越不亂，較不推薦)
     * @param  Array arr 要打亂的陣列
     * @return Array     打亂的陣列
     */
    var shuffle3 = function(arr) {
        return arr.sort(function() {
            return 0.5 - Math.random();
        });
    };

    /**
     * 交換陣列中的兩個位置 (沒有回傳值)
     * @param  Array array  陣列來源
     * @param  Number index1 陣列內要被交換的位罝1
     * @param  Number index2 陣列內要被交換的位罝2
     */
    var swap = function(array, index1, index2) {
        var temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    };

    /**
     * prototype 繼承 (需使用建構式function)
     * @param  Function Child  子建構式
     * @param  Function Parent 父建構式
     */
    var extend = function(Child, Parent) {
        var F = function() {};
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.prototype.parent = Parent.prototype; // 這一行只是為了讓 Child 可以調用到父對象的 prototype，屬備用性質。
    };


    /**
     * 深拷貝
     * @param  Function Parent 父物件
     * @param  Function Child  子物件
     */
    var deepCopy = function(p, c) {
        var c = c || {};

        for (var i in p) {
            if (typeof p[i] === 'object') {
                //如果 property 是物件或陣列
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


    var throttled = false;
    var throttle = function throttle(callback, delay) {
        return function(e) {
            if (!throttled) {
                callback(e);
                throttled = true;
                setTimeout(function() {
                    throttled = false;
                }, delay);
            }
        };
    }

    return {
        getUrlVars: getUrlVars,
        getUrlVar: getUrlVar,
        random: random,
        shuffle: shuffle,
        shuffle2: shuffle2,
        shuffle3: shuffle3,
        swap: swap,
        extend: extend,
        deepCopy: deepCopy,
        throttle: throttle
    }
})(window);