#Usage

    [Demo link](https://cgh20xx.github.io/Sprite/)

    var sp = new Sprite({
        el: '#test',
        fps: 30,
        // duration: 3000, //option
        width: 320,
        height: 320,
        imgBaseUrl: 'images/',
        imgName: 'demo-',
        imgType: '.png',
        imgStartIndex: 0,
        imgEndIndex: 27,
        repeat: 2,
        autoPlay: false
    }).init();

    sp
    .on('load', function(source) {
        console.log('preloaded');
        console.log(source);
        // sp.play();
    })
    .on('play', function() {
        console.log('play');
    })
    .on('stop', function() {
        console.log('stop');
    })
    .on('resume', function() {
        console.log('resume');
    });

    btnPlay.addEventListener('click', function(e) {
        sp.play();
    });

    btnStop.addEventListener('click', function(e) {
        sp.stop();
    });

    btnResume.addEventListener('click', function(e) {
        sp.resume();
    });
