import {Component, ViewChild} from '@angular/core';
import {CalendarComponent} from './calendar/calendar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'calendar';
  @ViewChild('calendar') calendar: CalendarComponent;

  onDateChange(event) {
    this.calendar.setValue(event.value);
  }
}


