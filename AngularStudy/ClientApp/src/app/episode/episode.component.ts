import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Episode } from '../Episode';
import { AudioPlayerService } from '../services/audio-player.service';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css']
})
export class EpisodeComponent implements OnInit {
  episode: Episode;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,

    @Inject('BASE_URL') private baseUrl: string,
  ) { }

  ngOnInit() {
    //https://tilos.hu/api/v1/episode/600e5e61b62e0d73f9ad6b68

    this.route.params.subscribe(params => {
      const id = params['id'];
      //console.log("alias: " + alias);

      const episodeUrl = `${this.baseUrl}api/v1/episode/${id}`;
      this.http.get<Episode>(episodeUrl).subscribe(result => {
        this.episode = result;
        //console.log(result);
      }, error => console.error(error));

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
