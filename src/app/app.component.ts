import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'calendar';
  value: Date = new Date();
  $calendar: any;

  ngOnInit() {
    this.$calendar = $('#calendar');


    const year = this.value.getFullYear();
    const month = this.value.getMonth();
    const day = this.value.getDate();

    const eventData = {
      events : [
        {'id':1, 'start': new Date(year, month, day, 12), 'end': new Date(year, month, day, 13, 35),'title':'Lunch with Mike'},
        {'id':2, 'start': new Date(year, month, day, 14), 'end': new Date(year, month, day, 14, 45),'title':'Dev Meeting'},
        {'id':3, 'start': new Date(year, month, day + 1, 18), 'end': new Date(year, month, day + 1, 18, 45),'title':'Hair cut'},
        {'id':4, 'start': new Date(year, month, day - 1, 8), 'end': new Date(year, month, day - 1, 9, 30),'title':'Team breakfast'},
        {'id':5, 'start': new Date(year, month, day + 1, 14), 'end': new Date(year, month, day + 1, 16),'title':'Product showcase'},
        {'id':5, 'start': new Date(year, month, day + 1, 15), 'end': new Date(year, month, day + 1, 17),'title':'Overlay event'}
      ]
    };

    this.$calendar.weekCalendar({
      timeslotsPerHour: 4,
      date: new Date(2010, 1, 1),
      scrollToHourMillis : 0,
      height: function($calendar){
        return $(window).height() - $('h1').outerHeight(true);
      },
      eventRender : function(calEvent, $event) {
        if (calEvent.end.getTime() < new Date().getTime()) {
          $event.css('backgroundColor', '#aaa');
          $event.find('.wc-time').css({
            backgroundColor: '#999',
            border:'1px solid #888'
          });
        }
      },
      eventNew : function(calEvent, $event, FreeBusyManager, calendar) {
        var isFree = true;
        $.each(FreeBusyManager.getFreeBusys(calEvent.start, calEvent.end), function() {
          if (
            this.getStart().getTime() != calEvent.end.getTime()
            && this.getEnd().getTime() != calEvent.start.getTime()
            && !this.getOption('free')
          ){
            isFree = false;
            return false;
          }
        });

        if (!isFree) {
          alert('looks like you tried to add an event on busy part !');
          $(calendar).weekCalendar('removeEvent',calEvent.id);
          return false;
        }
        alert('You\'ve added a new event. You would capture this event, add the logic for creating a new event with your own fields, data and whatever backend persistence you require.');


        calEvent.id = calEvent.userId +'_'+ calEvent.start.getTime();
        $(calendar).weekCalendar('updateFreeBusy', {
          userId: calEvent.userId,
          start: calEvent.start,
          end: calEvent.end,
          free:false
        });
      },
      data: function(start, end, callback) {
        var dataSource = $('#data_source').val();
        if (dataSource === '1') {
          callback(eventData);
        } else if(dataSource === '2') {
          callback(eventData);
        } else {
          callback({
            options: {
              defaultFreeBusy: {
                free:true
              }
            },
            events: []
          });
        }
      },
      showAsSeparateUser: true,
      displayOddEven: true,
      displayFreeBusys: true,
      daysToShow: 7,
      switchDisplay: {'1 day': 1, '3 next days': 3, 'work week': 5, 'full week': 7},
      headerSeparator: ' ',
      useShortDayNames: true,
    });
  }
  onClickMe() {
    this.$calendar.weekCalendar('gotoDate', this.value);
  }

}
