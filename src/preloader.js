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