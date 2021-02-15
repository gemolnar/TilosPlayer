import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalAudioPlayerService } from '../services/local-audio-player.service';
import { Episode } from '../Episode';
import { ShowDetail } from '../ShowDetail';
import { DateFormatterService } from '../services/date-formatter.service';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {

  public show: ShowDetail;
  public episodes: Episode[];

  private startTimestamp: number;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private localAudioPlayerService: LocalAudioPlayerService,
    private dateFormater: DateFormatterService,
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      const alias = params['alias'];
      const showUrl = `${this.baseUrl}api/v1/show/${alias}`;
      this.http.get<ShowDetail>(showUrl).subscribe(result => {
        this.show = result;
        //console.log(result);
      }, error => console.error(error));

      const y = params['y'];
      const m = params['m'];
      this.startTimestamp = +new Date(y, m - 1, 1);
      const lookahead = 32 * 24 * 60 * 60 * 1000; // lookahead time
      const episodesUrl = `${this.baseUrl}api/v1/show/${alias}/episodes?start=${this.startTimestamp}&end=${this.startTimestamp + lookahead}`;
      this.http.get<Episode[]>(episodesUrl).subscribe(result => {
        this.episodes = result.filter(s => s.persistent).sort((a, b) => a.plannedFrom - b.plannedFrom);
        //console.log(result);
      }, error => console.error(error));

    });
  }


  pagerButtonClicked(dir: number) {
    const originalStartDate = new Date(this.startTimestamp);
    const newDate = new Date(originalStartDate.setMonth(originalStartDate.getMonth() + dir));
    const url = this.router.createUrlTree(['../../', newDate.getFullYear(), newDate.getMonth() + 1], { relativeTo: this.route });
    //this.episodes = null;
    this.router.navigateByUrl(url);
  }

  public onPlayButtonClicked(episode: Episode) {
    this.localAudioPlayerService.startPlaybackEpisode(episode);
  }

  public getYearAndMonthFormatted(): string {
    return this.dateFormater.fromTimestamp(this.startTimestamp, 'YM');
  }

  public getIconClass(linkType: string) {
    switch (linkType) {
      case "facebook":
        return "bi bi-facebook";
      case "mixcloud":
        return "bi bi-x";
      default:
        return "bi bi-link";
    }
  }
}



