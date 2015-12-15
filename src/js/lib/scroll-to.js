const interval = 15, total = 300;

function getOffset(el) {
    return el ? el.offsetTop + getOffset(el.offsetParent) : 0;
}

function getH(el) {
    return el ? el.offsetHeight : 0;
    //document.getElementById('myDiv').offsetHeight
}

var animationFrame = window.requestAnimationFrame;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !animationFrame; ++x) {
    animationFrame = window[vendors[x]+'RequestAnimationFrame'];
}

animationFrame = animationFrame || function (cb) { setTimeout(cb, 13); };

export default function scrollTo(el, fixedEl) {
    var start = window.pageYOffset;
    var end = getOffset(el) - getH(fixedEl);
    var distance = end - start;
    var elapsed = 0;

    animationFrame(function scrollHandler() {
        var t = elapsed / total;
        window.scrollTo(0, Math.floor(start + distance * t * (2 - t)));
        if (elapsed < total) {
            elapsed += interval;
            animationFrame(scrollHandler);
        }
    });
};

