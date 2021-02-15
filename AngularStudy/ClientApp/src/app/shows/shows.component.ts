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
  }

  getYearMonthPath() {
    const d = new Date();
    return `${d.getFullYear()}/${d.getMonth() + 1}`;
  }
}
