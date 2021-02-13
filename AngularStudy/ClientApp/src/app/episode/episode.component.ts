import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalAudioPlayerService } from '../services/local-audio-player.service';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css']
})
export class EpisodeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,

    @Inject('BASE_URL') private baseUrl: string,
    private localAudioPlayerService: LocalAudioPlayerService,
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      //const alias = params['alias'];
      //console.log("alias: " + alias);

      //const showUrl = `${this.baseUrl}api/v1/show/${alias}`;
      //this.http.get<ShowDetail>(showUrl).subscribe(result => {
      //  this.show = result;
      //  //console.log(result);
      //}, error => console.error(error));

      //const end = +new Date();
      //const d = 60 * 24 * 60 * 60 * 1000;
      //const start = end - d;
      //const episodesUrl = `${this.baseUrl}api/v1/show/${alias}/episodes?start=${start}&end=${end}`;
      //this.http.get<Episode[]>(episodesUrl).subscribe(result => {
      //  this.episodes = result;
      //  //console.log(result);
      //}, error => console.error(error));

    });

  }

}
