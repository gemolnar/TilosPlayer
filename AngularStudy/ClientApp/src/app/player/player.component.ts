import { Component, OnInit } from '@angular/core';
import { logging } from 'protractor';
import { Episode } from '../Episode';
import { LocalAudioPlayerService } from '../services/local-audio-player.service';

declare const cast: any; // <-- important bit. you are using google's code here


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public currentEpisode: Episode;
  public progressPercent: number;
  public isPlaying = false;

  constructor(private localPlayer: LocalAudioPlayerService) {
    localPlayer.episodeChange.subscribe(e => this.currentEpisode = e);
    localPlayer.progressChange.subscribe(p => this.progressPercent = p);
    localPlayer.isPlayingStatusChange.subscribe(ip => this.isPlaying = ip);
  }

  ngOnInit() {
  }


  ngAfterViewInit() {
    // ChromeCast init
    const castContainer = document.getElementById("google-cast-launcher-container");
    const castLauncher = document.createElement("google-cast-launcher");
    castContainer.appendChild(castLauncher);
    // Init localPlayer with CC context
    const castContext = cast.framework.CastContext.getInstance();// as cast.framework.CastContext;
    this.localPlayer.initializeCast(castContext);
  }


  onProgressBarClicked(e: MouseEvent) {
    const p = e.offsetX / ((e.target as HTMLElement).clientWidth);
    this.localPlayer.seekTo(p);
  }


  onPauseClicked() {
    //this.isPlaying = false;
    this.localPlayer.pause();
  }

  onPlayClicked() {
    //this.isPlaying = true;
    this.localPlayer.play();
  }
}
