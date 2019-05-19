import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  constructor(private tr: TranslateService) {}

  transform(value: any): any {
    if (!moment.isMoment(value)) {
      value = moment(value);
    }
    const now = moment();
    //A positive number of days, means says in the future. Negative means the past.
    const days = value.diff(now, 'days');

    const time = value.format('H:mm');

    console.log(days);

    if (days < -30) {
      return value.format('ll LT')
      //return this.tr.instant('time.months-ago', { months: now.diff(value, 'months') });
    } else if (days < -1) {
      return this.tr.instant('time.days-ago', { days: Math.abs(days), time });
    } else if (days === -1) {
      return this.tr.instant('time.yesterday', { time });
    } else if (days === 0) {
      return this.tr.instant('time.today', { time });
    }
  }

}
