import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Show } from '../Show';
import { Observable } from 'rxjs';
import { ShowProviderService } from '../services/show-provider.service';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html'
})
export class ShowsComponent {

  public shows: Show[];

  constructor(s: ShowProviderService) {
    s.p.then(p => this.shows = p);
    
    //console.log("masodik show");
    //const getShow: Observable<Show[]> = http.get<Show[]>(baseUrl + 'api/v1/show');
    //console.log("masodik show: observable megvan");
    //const getShowPromise = getShow.toPromise();
    //console.log("masodik show: topromise megvan");
    //getShowPromise.then(s => console.log("masodik show: .then eloszor" + s.length));
    //getShowPromise.then(s => console.log("masodik show: .then masodszor" + s.length));
    //getShowPromise.then(s => console.log("masodik show: .then harmadszor" + s.length));
  }
}
