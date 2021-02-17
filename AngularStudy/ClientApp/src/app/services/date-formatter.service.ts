import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() { }


  fromTimestamp(unixTimestamp: number, format: 'LOCALE' | 'ISO' | 'D' | 'T' | 'TT' | 'MD' | 'DOW' | 'YM' | 'YS' ): string {

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

    let seconds = d.getSeconds() + "";
    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }

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
      case "TT":
        return `${hour}:${minutes}:${seconds}`;
      case "DOW":
        return `${dow}`;
      case "MD":
        return `${monthRoman}. ${day}.`;
      case "YM":
        return `${year}. ${monthText}`;
      case "YS":
        switch (d.getMonth()) {
          case 0:
          case 1:
            return `${d.getFullYear() - 1}-${(d.getFullYear().toString()).slice((d.getFullYear().toString()).length-2)} tél`;
          case 2:
          case 3:
          case 4:
            return `${d.getFullYear()} tavasz`;
          case 5:
          case 6:
          case 7:
            return `${d.getFullYear()} nyár`;
          case 8:
          case 9:
          case 10:
            return `${d.getFullYear()} ősz`;
          case 11:
            return `${d.getFullYear()}-${((d.getFullYear() + 1).toString()).slice(((d.getFullYear() + 1).toString()).length-2)} tél`;
          // d.slice(id.length - 5)
        }
        

    }
    return "UNKNOWN_FORMAT - " + d.toString();
  }

}
