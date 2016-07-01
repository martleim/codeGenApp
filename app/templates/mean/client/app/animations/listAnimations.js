(function() {

    
    var fillerAnimations = function () {
        var duration = 0.5;
        return {
            enter: function (element, done) {
                TweenMax.set(element, { scale: "0.05" });
                TweenMax.to(element, duration, { scale: "1", ease: Back.easeInOut, onComplete: done });
            },
            leave: function (element, done) {
                TweenMax.to(element, duration, { scale: "0.05", onComplete: done });
            }
        };
    };

    angular.module('mapApp').animation('.filler', fillerAnimations);

}());
