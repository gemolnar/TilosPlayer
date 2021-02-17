import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, ActivatedRoute, ParamMap } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ShowsComponent } from './shows/shows.component';
import { ShowComponent } from './show/show.component';
import { PlayerComponent } from './player/player.component';
import { FeedComponent } from './feed/feed.component';
import { ShowProviderService } from './services/show-provider.service';
import { DateFormatterService } from './services/date-formatter.service';
import { EpisodeComponent } from './episode/episode.component';
import { RootPageComponent } from './root-page/root-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ShowsComponent,
    ShowComponent,
    PlayerComponent,
    FeedComponent,
    EpisodeComponent,
    RootPageComponent,
  ],
  imports: [

    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,

    RouterModule.forRoot([
      { path: '', component: RootPageComponent, pathMatch: 'full' },
      { path: 'musorfolyam/:y/:m/:d', component: FeedComponent }, 
      { path: 'musorok', component: ShowsComponent },
      { path: 'musorok/:alias', component: ShowComponent },
      { path: 'adas/:id', component: EpisodeComponent },

    ], { scrollPositionRestoration: "enabled" })
  ],
  providers: [ShowProviderService, DateFormatterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
