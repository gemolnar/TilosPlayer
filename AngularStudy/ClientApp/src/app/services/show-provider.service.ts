import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Show } from '../Show';

@Injectable({
  providedIn: 'root'
})
//@Injectable()
export class ShowProviderService {

  shows: Show[];
  p: Promise<Show[]>;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

    console.log("ShowProviderService ctor");
    const getShow: Observable<Show[]> = http.get<Show[]>(baseUrl + 'api/v1/show');

    console.log("ShowProviderService: request started.");
    this.p = getShow.toPromise();
    console.log("ShowProviderService: promise initialized.");

    this.p
      .then(s => {
        this.shows = s;
        console.log("ShowProviderService: promise.then got the items: " + s.length);
      })
      .catch(e => {
        console.error("ShowProviderService error:");
        console.error(e);
      });
  }
}
