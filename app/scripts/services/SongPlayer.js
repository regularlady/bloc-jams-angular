(function(){
    function SongPlayer() {
        var SongPlayer = {};

        /**
        @desc: data for currently playing or paused song (number, title, duration)
        @type: {Object}
        **/
        var currentSong = null;

        /**
        @desc: Buzz object audio file
        @type: {Object}
        **/
        var currentBuzzObject = null;

        /**
        @function: setSong
        @desc: stops currently playing song and loads new audio file as currentBuzzObject
        @param: {Object} song
        **/
        var setSong = function(song) {
            if (currentBuzzObject){
                currentBuzzObject.stop();
                currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentSong = song;
        };
        /**
        @function: playSong (private)
        @desc: sets song attribute playing to true and plays currentBuzzObject
        @param: {Object} song
        **/
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };

        /**
        @function: SongPlayer.play (public method)
        @desc: If a new song is selected, uses setSong and playSong. If song is paused, plays currentBuzzObject.
        @param: {Object} song
        **/
        SongPlayer.play = function(song) {
            if (currentSong !== song) {
                setSong(song);
                playSong(song);
            }
            else if (currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }
            }
        };

        /**
        @function: SongPlayer.pause (public method)
        @desc: Pauses currentBuzzObject and sets song.playing to false
        @param: {Object} song
        **/
        SongPlayer.pause = function(song) {
        currentBuzzObject.pause();
        song.playing = false;
        };

        return SongPlayer;

    };

    angular
        .module('blocJams')
        .factory('SongPlayer',SongPlayer);
})();
