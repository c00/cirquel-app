import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  /**
  * Takes a number of seconds and turns it into mm:ss
  */
  transform(seconds: number) {
    let time: string;
    let minutes = Math.floor(seconds / 60);
    time = (minutes >= 10) ? String(minutes) : "0" + minutes;

    time += ":";

    seconds = Math.floor(seconds % 60);
    time += (seconds >= 10) ? String(seconds) : "0" + seconds;
    return time;
  }
}
