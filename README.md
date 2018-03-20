# Sprite.js
[Demo](https://cgh20xx.github.io/Sprite/)

# Download
[Sprite.js](https://cgh20xx.github.io/Sprite/js/Sprite.js)
[Sprite.min.js](https://cgh20xx.github.io/Sprite/js/Sprite.min.js)

# Example1
```javascript
var sp = new Sprite({
    el: '#test',
    fps: 18,
    // duration: 3000, // set duration will ignore fps
    width: 320,
    height: 320,
    imgBaseUrl: 'images/',
    imgName: 'demo-',
    imgType: '.png',
    imgStartIndex: 0,
    imgEndIndex: 27,
    repeat: -1,
    autoPlay: false
}).init();

sp
.on('load', function(source) {
    sp.play();
})
.on('play', function() {
    ...
})
.on('stop', function() {
    ...
})
.on('resume', function() {
    ...
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
```

# Example2

You can use .mount() append to HTMLElemnt.

```javascript
var sp = new Sprite({
    fps: 18,
    width: 320,
    height: 320,
    imgBaseUrl: 'images/',
    imgName: 'demo-',
    imgType: '.png',
    imgStartIndex: 0,
    imgEndIndex: 27,
    repeat: -1,
    autoPlay: false
}).init();

sp
.on('load', function(source) {
    var test = document.getElementById('test');
    this.mount(test);
})
.on('mounted', function() {
    this.play();
});
```