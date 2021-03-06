import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Episode } from '../Episode';
import { DateFormatterService } from '../services/date-formatter.service';
import { AudioPlayerService } from '../services/audio-player.service';
import { ShowProviderService } from '../services/show-provider.service';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})

export class FeedComponent implements OnInit {

  public episodes: Episode[];
  public currentDate: string;

  public datePickerModel: NgbDateStruct;
  date: { year: number; month: number };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject('BASE_URL') private baseUrl: string,
    private showProviderService: ShowProviderService,
    private dateFormater: DateFormatterService,
    private audioPlayerService: AudioPlayerService,
    private router: Router
  ) { }

  onNavigate(e: NgbDate) {
    //console.log("NAVIGATE", e.);
    const url = this.router.createUrlTree(['../../../', e.year, e.month, e.day], { relativeTo: this.route });
    this.episodes = null;
    this.router.navigateByUrl(url);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      const y = params['y'];
      const m = params['m'];
      const d = params['d'];

      
      //this.datePickerModel = this.calendar.getToday(); 
      this.datePickerModel = { year: parseInt(y), month: parseInt(m), day: parseInt(d) };

      const parsedDate = new Date(parseInt(y), parseInt(m) - 1, d);
      const currentDateTimestamp = +parsedDate;
      this.currentDate = this.dateFormater.fromTimestamp(currentDateTimestamp, 'D');

      const queryParam = this.createQuery(y, m, d);
      const apiUrl = `${this.baseUrl}api/v1/episode?${queryParam}`;

      this.http.get<Episode[]>(apiUrl).subscribe(result => {
        result.sort((a, b) => b.plannedFrom - a.plannedFrom);
        this.episodes = result.filter(e => e.m3uUrl !== null);
        //this.episodes.sort((a, b) => a.plannedFrom - b.plannedFrom);
        console.log(result);
        this.showProviderService.p.then(shows => {

          this.episodes.forEach(episode => {
            const show = shows.find(show => show.id === episode.show.id);
            episode.show = show;
          });


        });

      }, error => console.error(error));



    }, error => console.error(error));
  }



  pagerButtonClicked(dir: number) {
    //const originalStartDate = new Date(this.startTimestamp);
    //const newDate = new Date(originalStartDate.setMonth(originalStartDate.getMonth() + dir * 3));
    //this.startTimestamp = +newDate;
    //this.refreshEpisodes();
    //const url = this.router.createUrlTree(['../../', newDate.getFullYear(), newDate.getMonth() + 1], { relativeTo: this.route });
    //this.episodes = null;
    //this.router.navigateByUrl(url);
  }


  //getYearMonthPath(startTimeStamp: number) {
  //  const d = new Date(startTimeStamp);
  //  return `${d.getFullYear()}/${d.getMonth()+1}`;
  //}

  createQuery(y, m, d): string {
    // date: utolsó nap, ennél régebbi kell
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    const end = date.getTime() + 24 * 60 * 60 * 1000;
    //const end = start + 28800000;
    const start = end - 3 * 24 * 60 * 60 * 1000;
    return "start=" + start + "&end=" + end;
  }

  public onPlayButtonClicked(episode: Episode) {
    this.audioPlayerService.startPlaybackEpisode(episode);
  }
}
