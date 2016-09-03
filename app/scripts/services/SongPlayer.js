(function(){
    function SongPlayer(Fixtures) {
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
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
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

        /**
        * @function stopSong
        * @desc encapsulates song stopping behavior
        * @param {Object} song
        */
        var stopSong = function(song) {
          stopSong(SongPlayer.currentSong);
        };

        /**
        @function: SongPlayer.play (public method)
        @desc: If a new song is selected, uses setSong and playSong. If song is paused, plays currentBuzzObject.
        @param: {Object} song
        **/
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            }
            else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
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

          /*
          * @function SongPlayer.next
          * @desc selects next song in song list and plays/pauses accoordingly
          */

          SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex > currentAlbum.songs.length) {
              stopSong(SongPlayer.currentSong);
            } else {
              var song = currentAlbum.songs[currentSongIndex];
              setSong(song);
              playSong(song);
            }
          };

        return SongPlayer;

    };

    angular
        .module('blocJams')
        .factory('SongPlayer',SongPlayer);
})();
