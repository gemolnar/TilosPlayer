import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() { }


  fromTimestamp(unixTimestamp: number, format: 'LOCALE' | 'ISO' | 'D' | 'T' | 'MD' | 'DOW' | 'YM' ): string {

    const d = new Date(unixTimestamp);

    let year = d.getFullYear().toString();

    let month = '' + (d.getMonth() + 1);
    if (month.length < 2)
      month = '0' + month;

    let day = '' + d.getDate();
    if (day.length < 2)
      day = '0' + day;

    let hour = d.getHours() + "";
    let minutes = d.getMinutes() + "";
    if (minutes.length < 2)
      minutes = '0' + minutes;
    //let seconds = d.getSeconds() + "";

    const dowIndex = d.getDay();
    const dow = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'][dowIndex];
    const monthText = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december',][d.getMonth()];
    const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', "XII"][d.getMonth()];

    switch (format) {
      case "LOCALE":
        return d.toLocaleString();
      case "ISO":
        return d.toISOString()
      case "D":
        return `${year}. ${month}. ${day}.`;
      case "T":
        return `${hour}:${minutes}`;
      case "DOW":
        return `${dow}`;
      case "MD":
        return `${monthRoman}. ${day}.`;
      case "YM":
        return `${year}. ${monthText}`;

    }
    return "UNKNOWN_FORMAT - " + d.toString();
  }

}
