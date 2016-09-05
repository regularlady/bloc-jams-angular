(function() {
    function timecode() {
        return function(seconds) {
            if (Number.isNaN(seconds)) {
                return '-:--';
            }
            var output = buzz.toTimer(seconds);
            return output;
        };
    }
    angular
        .module('blocJams')
        .filter('timecode', timecode);
})();
