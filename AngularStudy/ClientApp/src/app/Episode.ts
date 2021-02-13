import { EpisodeDescription } from "./EpisodeDescription";
import { Show } from "./Show";

// https://tilos.hu/api/v1/show/7terito/episodes?start=1609455600000&end=1612393199999
export interface Episode {
    m3uUrl: string;
    url: string;
    plannedFrom: number;
    realFrom: number;
    plannedTo: number;
    realTo: number;
    show: Show;
    text: EpisodeDescription;
    extra: boolean;
    original: boolean;
    //tags
    //bookmarks
    //events
    persistent: boolean;
    //statListeners: any;
    inThePast: boolean;
}

