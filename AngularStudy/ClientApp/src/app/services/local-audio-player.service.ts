/// <reference path="../../../node_modules/@types/chromecast-caf-sender/index.d.ts" />

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Episode } from '../Episode';

@Injectable({
  providedIn: 'root'
})
export class LocalAudioPlayerService {

  private audioObj = new Audio();
  public episodeChange: BehaviorSubject<Episode>;
  public progressChange: BehaviorSubject<number>;
  public isPlayingStatusChange: BehaviorSubject<boolean>;

  constructor() {
    console.log("audioObj listeners set up");
    this.audioObj.addEventListener("timeupdate", this.onTimeUpdate.bind(this));
    this.audioObj.addEventListener("pause", this.onLocalPlayerPaused.bind(this));
    this.audioObj.addEventListener("play", this.onLocalPlayerPlaying.bind(this));
    

    this.episodeChange = new BehaviorSubject<Episode>(null);
    this.progressChange = new BehaviorSubject<number>(0);
    this.isPlayingStatusChange = new BehaviorSubject<boolean>(false);
  }

  // Player UI calls this when it initialized the Cast framwork, passes in its context
  initializeCast(castContext: cast.framework.CastContext) {
    castContext.addEventListener(      
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      function (event) {
        switch (event.sessionState) {
          case cast.framework.SessionState.SESSION_STARTED:
          case cast.framework.SessionState.SESSION_RESUMED:
            console.log('Player: CastSession connected');
            break;
          case cast.framework.SessionState.SESSION_ENDED:
            console.log('Player: CastSession disconnected');
            break;
        }
      });
  }

  private onLocalPlayerPaused(e: Event) {
    console.log("LocalPlayer paused." + e);
    this.isPlayingStatusChange.next(false);
  }

  private onLocalPlayerPlaying(e: Event) {
    console.log("LocalPlayer playing." + e);
    this.isPlayingStatusChange.next(true);
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  public onTimeUpdate(e: Event): void {
    const duration = this.audioObj.duration;
    const currentTime = this.audioObj.currentTime;
    const percent = (currentTime / duration) * 100;
    this.progressChange.next(percent);
    //console.log(`${currentTime} / ${duration} (${percent}%)` );
  }

  public startPlaybackEpisode(episode: Episode) {
    this.episodeChange.next(episode);
    const mp3Url = episode.m3uUrl.replace("m3u", "mp3");
    this.audioObj.src = mp3Url;
    this.audioObj.play();
  }

  public seekTo(p: number) {
    const currentTime = this.audioObj.duration * p;
    this.audioObj.currentTime = currentTime;
  }



}
