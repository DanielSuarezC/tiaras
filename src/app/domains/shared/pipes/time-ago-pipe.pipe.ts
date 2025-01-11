import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance } from 'date-fns';

@Pipe({
  name: 'timeAgoPipe',
  standalone: true
})
export class TimeAgoPipePipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    const today = new Date();
    return formatDistance(today, date);
  }
}
