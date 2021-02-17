import { ApplicationRef, Component, OnInit } from '@angular/core';
import { log } from 'console';
import { logging } from 'protractor';
import { Episode } from '../Episode';
import { AudioPlayerService } from '../services/audio-player.service';
import { DateFormatterService } from '../services/date-formatter.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  public currentEpisode: Episode;
  public progressPercent: number;
  public originallyAired: string = "-";
  public isPlaying = false;

  constructor(
    private audioPlayer: AudioPlayerService,
    private appRef: ApplicationRef,
    private dateFormater: DateFormatterService,
  ) {
    console.log("PlayerComponent ctor", appRef);
    audioPlayer.episodeChange.subscribe(e => this.currentEpisode = e);
    audioPlayer.progressChange.subscribe(p => this.onAudioPlayerProgressChanged(p)); 
    audioPlayer.isPlayingStatusChange.subscribe(ip => this.isPlaying = ip);
  }

  ngOnInit() {
  }


  onAudioPlayerProgressChanged(p: number) {
    this.progressPercent = p;
    // TODO: calculate "originally aired"
    if (this.currentEpisode && this.currentEpisode.realFrom && this.currentEpisode.realTo) {
      const length = this.currentEpisode.realTo - this.currentEpisode.realFrom;
      const progress = Math.round((length * p / 100));
      const originalAiredTimestamp = this.currentEpisode.realFrom + progress;
      this.originallyAired = this.dateFormater.fromTimestamp(originalAiredTimestamp, 'D') + " " + this.dateFormater.fromTimestamp(originalAiredTimestamp, 'TT');
    }
    else {
      console.error("Cannot set originallyAired:", this.currentEpisode);
    }

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

  getPlayerTitle(): string {

    if (!this.currentEpisode) {
      return "nincs lejátszott adás";
    }

    let firstPart: string;
    if (this.currentEpisode.show) {
      if (this.currentEpisode.show.name) {
        firstPart = this.currentEpisode.show.name;
      }
      else {
        firstPart = this.currentEpisode.show.id;
      }
    }
    else {
      firstPart = "ISMERETLEN MŰSOR";
    }

    let secondPart: string;
    if (this.currentEpisode.text && this.currentEpisode.text.title) {
      secondPart = this.currentEpisode.text.title;
    }
    else {
      secondPart = this.dateFormater.fromTimestamp(this.currentEpisode.plannedFrom, "MD");
    }

    return `${firstPart} - ${secondPart}`;
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
