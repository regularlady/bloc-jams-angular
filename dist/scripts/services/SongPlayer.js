(function(){
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        /**
        @desc: current album data from fixtures service
        @type: {Object}
        **/
        var currentAlbum = Fixtures.getAlbum();

        /**
        @function: getSongIndex
        @desc: returns the index of song in currentAlbum
        @param: {Object} song
        @return: {Number}
        **/
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        }

        /**
        @desc: data for currently playing or paused song (number, title, duration)
        @type: {Object}
        **/
        SongPlayer.currentSong = null;

        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;

        /**
        @desc: Current volume (range: 0-100)
        @type: {Number}
        */
        SongPlayer.currentVolume = null;

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
                stopSong(SongPlayer.currentSong);
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
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

        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        };

        /**
        @function: SongPlayer.play (public method)
        @desc: If a new song is selected, uses setSong and playSong. If song is paused, plays currentBuzzObject.
        @param: {Object} song
        **/
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;

            if (song === null) {
                song = currentAlbum.songs[0];
                setSong(song);
                playSong(song);
            } else {
                if (SongPlayer.currentSong !== song) {
                    setSong(song);
                    playSong(song);
                }
                else if (SongPlayer.currentSong === song) {
                    if (currentBuzzObject && currentBuzzObject.isPaused()) {
                        playSong(song);
                    }
                }
            }
        };


        /**
        @function: SongPlayer.pause (public method)
        @desc: Pauses currentBuzzObject and sets song.playing to false
        @param: {Object} song
        **/
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };

        /**
        @function: SongPlayer.previous
        @desc: uses getSongIndex and decreases the index by one to get the index of the previous song and plays it, or stops playing if index < 0.
        **/
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0) {
                stopSong(SongPlayer.currentSong);
            }
            else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if(currentSongIndex === currentAlbum.songs.length) {
                stopSong(SongPlayer.currentSong);
            }
            else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
        * @function SongPlayer.mute
        * @desc lets the user mute the current song playing
        * @param {Object} song
        */
        SongPlayer.mute = function(song) {
            song = song || SongPlayer.currentSong
            currentBuzzObject.mute();
            song.isMuted = true;
        }

        /**
        * @function SongPlayer.unmute
        * @desc lets the user unmute the current song playing
        * @param {Object} song
        */
        SongPlayer.unmute = function(song) {
            song = song || SongPlayer.currentSong
            currentBuzzObject.unmute();
            song.isMuted = false;
        }

        return SongPlayer;

    };

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {Number} time
    */
    SongPlayer.setCurrentTime = function(time) {
     if (currentBuzzObject) {
         currentBuzzObject.setTime(time);
     }
    };

    /**
    * @function SongPlayer.setVolume
    * @desc Set volume level of currently playing song
    * @param {Number} volume
    */

    SongPlayer.setVolume = function(volume) {
        currentBuzzObject.setVolume(volume);
        currentVolume = volume;
    };

    angular
        .module('blocJams')
        .factory('SongPlayer',['$rootScope', 'Fixtures', SongPlayer]);
})();
