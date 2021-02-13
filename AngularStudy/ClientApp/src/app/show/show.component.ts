import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalAudioPlayerService } from '../services/local-audio-player.service';
import { Episode } from '../Episode';
import { ShowDetail } from '../ShowDetail';
import { DateFormatterService } from '../services/date-formatter.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  public show: ShowDetail;
  public episodes: Episode[];

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private route: ActivatedRoute,
    private localAudioPlayerService: LocalAudioPlayerService,
    private dateFormater: DateFormatterService
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const alias = params['alias'];
      console.log("alias: " + alias);

      const showUrl = `${this.baseUrl}api/v1/show/${alias}`;
      this.http.get<ShowDetail>(showUrl).subscribe(result => {
        this.show = result;
        //console.log(result);
      }, error => console.error(error));

      const end = +new Date();
      const d = 60 * 24 * 60 * 60 * 1000;
      const start = end - d;
      const episodesUrl = `${this.baseUrl}api/v1/show/${alias}/episodes?start=${start}&end=${end}`;
      this.http.get<Episode[]>(episodesUrl).subscribe(result => {
        this.episodes = result;
        //console.log(result);
      }, error => console.error(error));

    });
  }



  public onPlayButtonClicked(episode: Episode) {
    //console.log(episode);
    //const clickedEpisode = this.episodes.find(e => e.url === episode.url);
    //const mp3Url = clickedEpisode.m3uUrl.replace("m3u", "mp3");
    //this.localAudioPlayerService.startPlayback(mp3Url);

    this.localAudioPlayerService.startPlaybackEpisode(episode);
  }

}



