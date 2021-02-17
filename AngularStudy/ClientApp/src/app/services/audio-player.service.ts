/// <reference path="../../../node_modules/@types/chromecast-caf-sender/index.d.ts" />

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Episode } from '../Episode';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  private localPlayer = new Audio();
  //private remotePlayer: cast.framework.RemotePlayer;


  public episodeChange: BehaviorSubject<Episode>;
  public progressChange: BehaviorSubject<number>;
  public isPlayingStatusChange: BehaviorSubject<boolean>;

  constructor() {
    this.localPlayer.addEventListener("timeupdate", this.onLocalPlayerTimeUpdate.bind(this));
    this.localPlayer.addEventListener("pause", this.onLocalPlayerPaused.bind(this));
    this.localPlayer.addEventListener("play", this.onLocalPlayerPlaying.bind(this));

    this.episodeChange = new BehaviorSubject<Episode>(null);
    this.progressChange = new BehaviorSubject<number>(0);
    this.isPlayingStatusChange = new BehaviorSubject<boolean>(false);
    console.log("AudioPlayerService constructed.");
  }

  private isCastActive(): boolean {
    if (this.castSession === null) {
      return false;
    }
    return true;
  }

  //private castContext: cast.framework.CastContext = null;
  private castSession: cast.framework.CastSession = null;

  // -- CAST 01. ----
  // Player UI calls this when it initialized the Cast framwork.
  initializeCast() {
    const castContext = cast.framework.CastContext.getInstance();
    // Set up connection changed event listeners:
    if (castContext) {
      castContext.addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED, (e: cast.framework.SessionStateEventData) => {
          console.log("PlayerService: SESSION_STATE_CHANGED", e);
          switch (e.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED:
            case cast.framework.SessionState.SESSION_RESUMED:
              this.castSession = e.session;
              break;
            default:
              this.castSession = null;
              break;
          }
          if (this.castSession) {
            console.log("PlayerService: Cast session estabilished on", this.castSession.getCastDevice().friendlyName);
            this.onRemoteConnected();
          }
          else {
            console.log("PlayerService: Cast session finished.");
          }
        }
      );
      console.log("PlayerService: Session state change listener on CastContext set up .");
    }
    else {
      console.error("PlayerService: initializeCast() called, but CastContext cannot be retrieved.");
    }

    // Just for test....
    castContext.addEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED, (e: cast.framework.CastStateEventData) => console.log("PlayerService: CAST_STATE_CHANGED", e.castState)
    );

  }

  ngOnDestroy(): void {
    console.log("PlayerService: ngOnDestroy");
  }



  private getRemotePlayer(): cast.framework.RemotePlayer {
    return new cast.framework.RemotePlayer();
  }



  private onRemoteConnected() {
    console.log("onRemoteConnected()");
    
    const remotePlayer = this.getRemotePlayer();
    const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);
    
    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, this.onRemotePlayerTimeUpdate.bind(this)
      //cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, (e: cast.framework.RemotePlayerChangedEvent<any>) => { console.log(e); }
    );
    
    remotePlayerController.addEventListener(
      cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED, this.onRemotePlayerIsPausedChanged.bind(this)
    )

    console.log("onRemoteConnected - this.localPlayer.paused, currentTime: ", this.localPlayer.paused, this.localPlayer.currentTime)
    if (remotePlayer.playerState === chrome.cast.media.PlayerState.PLAYING) {
      console.log("REMOTE IS PLAYING", remotePlayer.displayName, remotePlayer.mediaInfo);
      
    }
    else if (!this.localPlayer.paused && this.localPlayer.currentTime) {

      const mediaInfo = new chrome.cast.media.MediaInfo(this.episodeChange.value.m3uUrl.replace("m3u", "mp3"), "audio/mp3");
      const metadata = new chrome.cast.media.MusicTrackMediaMetadata();
      metadata.artistName = this.episodeChange.value.show.name;
      metadata.title = this.episodeChange.value.text.title;
      metadata.artistName = "Tilos Rádió";
      mediaInfo.metadata = metadata;

      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      this.castSession.loadMedia(request).then(
        function () { console.log('Load succeed'); },
        function (errorCode) { console.log('Error code: ' + errorCode); });
    }

  }

  private onRemoteDisconnected() {
    //this.remotePlayer = null;
    
    console.log('Player: CastSession disconnected');
  }

  private onRemotePlayerIsPausedChanged(evt: cast.framework.RemotePlayerChangedEvent<any>) {

    this.isPlayingStatusChange.next(this.getRemotePlayer().isPaused);
  }

  private onLocalPlayerPaused(e: Event) {
    console.log("LocalPlayer paused.", e);
    this.isPlayingStatusChange.next(false);
  }

  private onLocalPlayerPlaying(e: Event) {
    console.log("LocalPlayer playing." + e);
    this.isPlayingStatusChange.next(true);
  }

  play() {
    if (this.isCastActive()) {
      const remotePlayer = this.getRemotePlayer();
      if (remotePlayer.isPaused) {
        remotePlayer.controller.playOrPause();
      }
    }
    else {
      this.localPlayer.play();
    }
  }

  pause() {
    if (this.isCastActive()) {
      const remotePlayer = this.getRemotePlayer();
      if (!remotePlayer.isPaused) {
        remotePlayer.controller.playOrPause();
      }
    }
    else {
      this.localPlayer.pause();
    }
  }


  // Time update - called when playback progresses
  public onLocalPlayerTimeUpdate(e: Event): void {
    const duration = this.localPlayer.duration;
    const currentTime = this.localPlayer.currentTime;
    const percent = (currentTime / duration) * 100;
    this.progressChange.next(percent);
    //console.log(`${currentTime} / ${duration} (${percent}%)` );
  }

  private onRemotePlayerTimeUpdate(e: cast.framework.RemotePlayerChangedEvent<number>) {
    if (this.castSession) {
      const mediaSession = this.castSession.getMediaSession();
      if (mediaSession && mediaSession.media) {
        const duration = mediaSession.media.duration;
        const currentTime = e.value;
        const percent = (currentTime / duration) * 100;
        //console.log("REMOTE ON TIME UPDATE, percent: ", percent, duration, currentTime)
        this.progressChange.next(percent);
      }
      else {
        console.warn("onRemotePlayerTimeUpdate() was called, but no mediaSession could be found.")
      }
    }
    else {
      console.warn("onRemotePlayerTimeUpdate() was called, but no castSession could be found.")
    }
  }


  public startPlaybackEpisode(episode: Episode) {
    if (!episode || !episode.m3uUrl) {
      //inThePast
      console.error("Invalid episode.", episode);
      throw new Error("Invalid episode.");
    }

    this.episodeChange.next(episode);
    
    if (this.isCastActive()) {

      const mediaInfo = new chrome.cast.media.MediaInfo(episode.m3uUrl.replace("m3u", "mp3"), "audio/mp3");
      const metadata = new chrome.cast.media.MusicTrackMediaMetadata();
      metadata.albumName = episode.show.name;
      metadata.title = (episode.text !== null) ? episode.text.title : "nincstitle";
      //metadata.artistName = "Tilos Rádió";
      metadata.artist = "Tilos Rádió";
      mediaInfo.metadata = metadata;

      const request = new chrome.cast.media.LoadRequest(mediaInfo);
      const session = cast.framework.CastContext.getInstance().getCurrentSession();

      session.loadMedia(request).then(
        function () { console.log('Load succeed'); },
        function (errorCode) { console.log('Error code: ' + errorCode); });

    }
    else {
      const mp3Url = episode.m3uUrl.replace("m3u", "mp3");
      this.localPlayer.src = mp3Url;
      this.localPlayer.play();

    }
  }

  public seekTo(p: number) {
    if (this.isCastActive()) {
      


      const remotePlayer = this.getRemotePlayer();
      const remotePlayerController = new cast.framework.RemotePlayerController(remotePlayer);
      const currentTime = remotePlayer.duration * p;
      console.log("Remote seekto", p, remotePlayer.duration);
      remotePlayer.currentTime = currentTime;
      remotePlayerController.seek();
    }
    else {
      const currentTime = this.localPlayer.duration * p;
      this.localPlayer.currentTime = currentTime;
    }
  }



}
