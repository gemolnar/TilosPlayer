
class Episode {
    id: string;
    mediaUrl: string;
    show: Show;
    lengthInSeconds: number;
    text: EpisodeText;
    type: string;
    composedTitle: string;
}

class Show {
    id: string;
    name: string;
}

class EpisodeText {
    title: string;
    content: string;
}

enum PlayerMode {
    Local,
    Cast
}

class TilosPlayer {


    localPlayer: HTMLAudioElement = <HTMLAudioElement>document.createElement("AUDIO");

    remotePlayer: cast.framework.RemotePlayer;
    remotePlayerController: cast.framework.RemotePlayerController;

    constructor() {
        this.localPlayer.ontimeupdate = (e) => this.onLocalTimeUpdate(e);
        //this.onRemotePlayerConnectedChanged = this.onRemotePlayerConnectedChanged.bind(this);
        this.initializeCastApi = this.initializeCastApi.bind(this);
        this.onProgBar = this.onProgBar.bind(this);
        this.mode = PlayerMode.Local;
    }

    playing: string;
    currentEpisode: Episode;
    mode: PlayerMode;

    onLocalTimeUpdate(e: Event) {
        const player = <HTMLAudioElement>e.srcElement;
        const currentSeconds = player.currentTime;
        const totalSeconds = this.currentEpisode.lengthInSeconds;
        const currentPercent = (currentSeconds / totalSeconds) * 100;
        $("#progressbar").width(currentPercent + "%");
    }

    pause() {
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
    }

    play() {
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
    }

    seekToPercent(p: number) {
        var toSeconds = this.currentEpisode.lengthInSeconds * p / 100;
        if (this.mode == PlayerMode.Cast) {
            this.remotePlayer.currentTime = toSeconds;
            this.remotePlayerController.seek();
        }
        else {
            console.log(toSeconds);
            this.localPlayer.currentTime = toSeconds;
        }
    }

    refresh() {
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
    }

    public onRemotePlayerTimeUpdated(e: cast.framework.RemotePlayerChangedEvent) {
        console.log("RemotePlayer seconds: " + e.value);
    }
    public onRemotePlayerVolumeLevelChanged(e: cast.framework.RemotePlayerChangedEvent) {
        console.log("RemotePlayer volume: " + e.value * 100 + "%");
    }

    
    public onRemotePlayerConnectedChanged(e: cast.framework.RemotePlayerChangedEvent) {
        if (e.field === "isConnected") {
            if (e.value === true) {
                this.mode = PlayerMode.Cast;
            }
            else {
                this.mode = PlayerMode.Local;
            }
        }
    }

    onProgBar(e: JQuery.Event) {
        console.log("TilosPlayer.OnProgBar");
        var progressBarContainer = (<HTMLElement>e.target).getBoundingClientRect();

        var width = progressBarContainer.right - progressBarContainer.left;
        var clickPosition = e.clientX - progressBarContainer.left;
        var positionPercent = (clickPosition / width) * 100;
        console.log(`Seek to ${positionPercent}%.`);
        this.seekToPercent(positionPercent);
    }

    initializeCastApi(loaded: boolean, error: any) {
        if (!loaded) {
            console.log(error);
            console.log("Cast framework cannot be initialized.");
            return;
        }

        var receiverApplicationId: string = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
        //receiverApplicationId: string = "46E57F3C";

        console.log("Initializing Cast API - receiver app id: " + receiverApplicationId);
        cast.framework.CastContext.getInstance().setOptions({
            receiverApplicationId: receiverApplicationId,
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });

        console.log("Initializing remote player controller.");
        this.remotePlayer = new cast.framework.RemotePlayer();;
        this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);

        console.log("Listen to player properties changes.");

        this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, (e) => this.onRemotePlayerConnectedChanged(e));

        this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, (e) => this.onRemotePlayerTimeUpdated(e));
        //this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.DURATION_CHANGED, (e) => this.onRemotePlayerTimeUpdated(e));
        this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED, (e) => this.onRemotePlayerVolumeLevelChanged(e));

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



    }
}