import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AudioPlayerService } from '../services/audio-player.service';
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
    private audioPlayerService: AudioPlayerService,
    private dateFormater: DateFormatterService,
  ) {

  }

  //private selectedSeasonTimestamp: number;
  private page: number;

  private alias: string;

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.alias = params['alias'];
      const showUrl = `${this.baseUrl}api/v1/show/${this.alias}`;
      this.http.get<ShowDetail>(showUrl).subscribe(result => {
        this.show = result;
        //console.log(result);
      }, error => console.error(error));


      //const m = s * 3;
      // 1 -> 3 (2 in js)
      // 2 -> 6 (5 in js)
      // 3 -> 9
      // 4 -> 12



      this.startTimestamp = +new Date(this.getSeasonStartDate());

      this.refreshEpisodes();
    });
  }


  private refreshEpisodes() {
    const oneDay = 24 * 60 * 60 * 1000;
    const lookback = 12 * oneDay;
    const lookahead = 110 * oneDay;
    const episodesUrl = `${this.baseUrl}api/v1/show/${this.alias}/episodes?start=${this.startTimestamp - lookback}&end=${this.startTimestamp + lookahead}`;
    this.http.get<Episode[]>(episodesUrl).subscribe(result => {
      this.episodes = result.filter(s => s.persistent).sort((a, b) => a.plannedFrom - b.plannedFrom);
      //console.log(result);
    }, error => console.error(error));

  }

  private getSeasonStartDate() {
    const now = new Date();
    const m = now.getMonth();
    if (m == 0 || m == 1) {
      return new Date(now.getFullYear() - 1, 11, 1);
    }
    else if (m == 2 || m == 3 || m == 4) {
      return new Date(now.getFullYear(), 2)
    }
    else if (m == 5 || m == 6 || m == 7) {
      return new Date(now.getFullYear(), 5)
    }
    else {
      return new Date(now.getFullYear(), 8)
    }
          // mostani dátum hónapja alapján
      // 1, 2: előző év 12 (0, 1 in js)
      // 3, 4, 5: 3
      // 6,7,8: 6
      // lesz a 0
      // ehhez képest page
      // page

  }

  pagerButtonClicked(dir: number) {
    const originalStartDate = new Date(this.startTimestamp);
    const newDate = new Date(originalStartDate.setMonth(originalStartDate.getMonth() + dir * 3));
    this.startTimestamp = +newDate;
    this.refreshEpisodes();
    //const url = this.router.createUrlTree(['../../', newDate.getFullYear(), newDate.getMonth() + 1], { relativeTo: this.route });
    //this.episodes = null;
    //this.router.navigateByUrl(url);
  }

  public onPlayButtonClicked(episode: Episode) {
    this.audioPlayerService.startPlaybackEpisode(episode);
  }

  public getYearAndMonthFormatted(): string {
    return this.dateFormater.fromTimestamp(this.startTimestamp, 'YS');
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



