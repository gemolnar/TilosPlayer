import { Contributor } from "./Contributor";
import { Url } from "./Url";


export interface ShowDetail {
  id: string;
  name: string;
  alias: string;
  definition: string;
  type: string; //"MUSIC",
  status: string; //"OLD"
  description: string;
  urls: Url[];
  contributors: Contributor[];
  //schedulings

}


// https://tilos.hu/api/v1/show/kolorlokal
