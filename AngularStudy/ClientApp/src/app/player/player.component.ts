import { ApplicationRef, Component, OnInit } from '@angular/core';
import { log } from 'console';
import { logging } from 'protractor';
import { Episode } from '../Episode';
import { AudioPlayerService } from '../services/audio-player.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public currentEpisode: Episode;
  public progressPercent: number;
  public isPlaying = false;

  constructor(private audioPlayer: AudioPlayerService, private appRef: ApplicationRef) {
    console.log("PlayerComponent ctor", appRef);
    audioPlayer.episodeChange.subscribe(e => this.currentEpisode = e);
    audioPlayer.progressChange.subscribe(p => this.onAudioPlayerProgressChanged(p)); 
    audioPlayer.isPlayingStatusChange.subscribe(ip => this.isPlaying = ip);
  }

  ngOnInit() {
  }


  onAudioPlayerProgressChanged(p: number) {
    this.progressPercent = p;
    this.appRef.tick();
    //console.log("ProgressPercent updated", p, this.currentEpisode);
  }

  ngAfterViewInit() {
    const castContainer = document.getElementById("google-cast-launcher-container");
    castContainer.addEventListener("castinitialized", () => {
      castContainer.hidden = false;
      const castLauncher = document.createElement("google-cast-launcher");
      castContainer.appendChild(castLauncher);
      this.audioPlayer.initializeCast();
    });
  }


  onProgressBarClicked(e: MouseEvent) {
    const p = e.offsetX / ((e.target as HTMLElement).clientWidth);
    this.audioPlayer.seekTo(p);
  }


  onPauseClicked() {
    //this.isPlaying = false;
    this.audioPlayer.pause();
  }

  onPlayClicked() {
    //this.isPlaying = true;
    this.audioPlayer.play();
  }
}
