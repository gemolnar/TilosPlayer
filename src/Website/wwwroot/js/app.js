var Episode = /** @class */ (function () {
    function Episode() {
    }
    return Episode;
}());
var Show = /** @class */ (function () {
    function Show() {
    }
    return Show;
}());
var EpisodeText = /** @class */ (function () {
    function EpisodeText() {
    }
    return EpisodeText;
}());
var PlayerMode;
(function (PlayerMode) {
    PlayerMode[PlayerMode["Local"] = 0] = "Local";
    PlayerMode[PlayerMode["Cast"] = 1] = "Cast";
})(PlayerMode || (PlayerMode = {}));
var TilosPlayer = /** @class */ (function () {
    function TilosPlayer() {
        var _this = this;
        this.localPlayer = document.createElement("AUDIO");
        this.localPlayer.ontimeupdate = function (e) { return _this.onLocalTimeUpdate(e); };
        //this.onRemotePlayerConnectedChanged = this.onRemotePlayerConnectedChanged.bind(this);
        this.initializeCastApi = this.initializeCastApi.bind(this);
        this.onProgBar = this.onProgBar.bind(this);
        this.mode = PlayerMode.Local;
    }
    TilosPlayer.prototype.onLocalTimeUpdate = function (e) {
        var player = e.srcElement;
        var currentSeconds = player.currentTime;
        var totalSeconds = this.currentEpisode.lengthInSeconds;
        var currentPercent = (currentSeconds / totalSeconds) * 100;
        $("#progressbar").width(currentPercent + "%");
    };
    TilosPlayer.prototype.pause = function () {
        if (this.mode == PlayerMode.Cast) {
            console.log("RemotePlayer:Pause");
            if (this.remotePlayer.playerState == chrome.cast.media.PlayerState.PLAYING) {
                this.remotePlayerController.playOrPause();
            }
        }
        else {
            this.localPlayer.pause();
        }
        $("#pauseButton").hide();
        $("#playButton").show();
    };
    TilosPlayer.prototype.play = function () {
        if (this.mode == PlayerMode.Cast) {
            if (this.remotePlayer.playerState == chrome.cast.media.PlayerState.PAUSED) {
                this.remotePlayerController.playOrPause();
            }
            console.log("RemotePlayer:Play");
        }
        else {
            console.log("LocalPlayer:Play");
            this.localPlayer.play();
        }
        $("#pauseButton").show();
        $("#playButton").hide();
    };
    TilosPlayer.prototype.seekToPercent = function (p) {
        var toSeconds = this.currentEpisode.lengthInSeconds * p / 100;
        if (this.mode == PlayerMode.Cast) {
            this.remotePlayer.currentTime = toSeconds;
            this.remotePlayerController.seek();
        }
        else {
            console.log(toSeconds);
            this.localPlayer.currentTime = toSeconds;
        }
    };
    TilosPlayer.prototype.refresh = function () {
        $("#currentShowName").text(this.currentEpisode.show.name);
        if (this.mode == PlayerMode.Cast) {
            console.log("PlayerMode.Cast");
            var session = cast.framework.CastContext.getInstance().getCurrentSession();
            var mediaInfo = new chrome.cast.media.MediaInfo(this.currentEpisode.mediaUrl, "audio/mpeg");
            var mediaInfoMetadata = new chrome.cast.media.MusicTrackMediaMetadata();
            mediaInfoMetadata.title = this.currentEpisode.show.name;
            mediaInfoMetadata.artist = "artist";
            mediaInfoMetadata.albumName = "album name";
            mediaInfoMetadata.albumArtist = "album artist";
            mediaInfoMetadata.discNumber = 66;
            mediaInfoMetadata.songName = "song name";
            mediaInfoMetadata.releaseDate = "2016-01-02";
            mediaInfoMetadata.trackNumber = 33;
            mediaInfo.metadata = mediaInfoMetadata;
            var request = new window.chrome.cast.media.LoadRequest(mediaInfo);
            session.loadMedia(request);
        }
        else {
            console.log("PlayerMode.Local");
            this.localPlayer.src = this.currentEpisode.mediaUrl;
            this.localPlayer.play();
        }
    };
    TilosPlayer.prototype.onRemotePlayerTimeUpdated = function (e) {
        console.log("RemotePlayer seconds: " + e.value);
    };
    TilosPlayer.prototype.onRemotePlayerVolumeLevelChanged = function (e) {
        console.log("RemotePlayer volume: " + e.value * 100 + "%");
    };
    TilosPlayer.prototype.onRemotePlayerConnectedChanged = function (e) {
        if (e.field === "isConnected") {
            if (e.value === true) {
                this.mode = PlayerMode.Cast;
            }
            else {
                this.mode = PlayerMode.Local;
            }
        }
    };
    TilosPlayer.prototype.onProgBar = function (e) {
        console.log("TilosPlayer.OnProgBar");
        var progressBarContainer = e.target.getBoundingClientRect();
        var width = progressBarContainer.right - progressBarContainer.left;
        var clickPosition = e.clientX - progressBarContainer.left;
        var positionPercent = (clickPosition / width) * 100;
        console.log("Seek to " + positionPercent + "%.");
        this.seekToPercent(positionPercent);
    };
    TilosPlayer.prototype.initializeCastApi = function (loaded, error) {
        var _this = this;
        if (!loaded) {
            console.log(error);
            console.log("Cast framework cannot be initialized.");
            return;
        }
        var receiverApplicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
        //receiverApplicationId: string = "46E57F3C";
        console.log("Initializing Cast API - receiver app id: " + receiverApplicationId);
        cast.framework.CastContext.getInstance().setOptions({
            receiverApplicationId: receiverApplicationId,
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });
        console.log("Initializing remote player controller.");
        this.remotePlayer = new cast.framework.RemotePlayer();
        ;
        this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
        console.log("Listen to player properties changes.");
        this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, function (e) { return _this.onRemotePlayerConnectedChanged(e); });
        this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, function (e) { return _this.onRemotePlayerTimeUpdated(e); });
        //this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.DURATION_CHANGED, (e) => this.onRemotePlayerTimeUpdated(e));
        this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED, function (e) { return _this.onRemotePlayerVolumeLevelChanged(e); });
        //this.remotePlayerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, function () {
        //        if (this.remotePlayer.isConnected) {
        //            console.log("Player connected.")
        //            this.mode = PlayerMode.Cast;
        //            // Continue playing remotely what is playing locally.
        //        } else {
        //            this.mode = PlayerMode.Local;
        //            console.log("Player disconnected.")
        //            // Continue playing locally what is playing remotely.
        //            //if (player.savedPlayerState && player.savedPlayerState.mediaInfo) {
        //            //    var mediaId =
        //            //        getMediaIndex(player.savedPlayerState.mediaInfo.contentId);
        //            //    if (mediaId >= 0) {
        //            //        playLocally(
        //            //            mediaId, player.savedPlayerState.currentTime,
        //            //            player.savedPlayerState.isPaused);
        //            //}
        //        }
        //    });
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, updateSeek);
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.DURATION_CHANGED, updateSeek);
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED, updateVolume);
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED, function () {
        //        $('playPauseButton').innerText = player.isPaused ? 'Play' : 'Pause';
        //    });
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED, function () {
        //        $('muteButton').innerText = player.isMuted ? 'Unmute' : 'Mute';
        //    });
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.CAN_PAUSE_CHANGED, function () {
        //        $('playPauseButton').disabled = !player.canPause;
        //    });
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.IMAGE_URL_CHANGED, function () {
        //        $('mediaImage').src = player.imageUrl;
        //        $('mediaImage').hidden = !player.imageUrl;
        //    });
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.STATUS_TEXT_CHANGED, function () {
        //        $('statusText').innerText = player.statusText;
        //    });
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.TITLE_CHANGED, function () {
        //        $('mediaTitle').innerText = player.title;
        //    });
        //playerController.addEventListener(
        //    cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED, function () {
        //        var newVal = player.mediaInfo;
        //        var subtitle =
        //            (newVal && newVal.metadata && newVal.metadata.subtitle) || '';
        //        $('mediaDesc').innerText = subtitle;
        //    });
    };
    return TilosPlayer;
}());
//# sourceMappingURL=app.js.map