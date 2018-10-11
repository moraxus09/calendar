import {Component, OnInit} from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  private $calendar: any;
  private $timeSlots: any;
  private $currentDraggingEvent: any;
  private $currentEventMirror: any;
  private eventDragging = false;

  constructor() { }

  ngOnInit() {
    this.$calendar = $('#calendar');
    this.$calendar.weekCalendar({
      timeslotsPerHour: 4,
      timeslotHeight: 20,
      scrollToHourMillis : 0,
      height: this.getCalendarHeight,
      eventDrag: this.onEventDrag.bind(this),
      eventDrop: this.onEventDrop.bind(this),
      showAsSeparateUser: true,
      displayOddEven: true,
      daysToShow: 7,
      switchDisplay: {'1 day': 1, '3 next days': 3, 'work week': 5, 'full week': 7},
      headerSeparator: ' ',
      useShortDayNames: true,
    });
    this.$timeSlots = $('.wc-time-slot');

    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private getCalendarHeight() {
    return $(window).height();
  }

  private onEventDrag(calEvent, $element) {
    this.$currentEventMirror = $element
      .css('opacity', 1)
      .clone()
      .css({
        opacity: 0.5,
        top: Number.parseFloat($element.css('top'))})
      .addClass('mirror')
      .insertAfter($element);
    this.$currentDraggingEvent = $element;
    this.eventDragging = true;
  }

  private onEventDrop() {
    this.$currentEventMirror.remove();
    this.$currentEventMirror = null;
    this.$currentDraggingEvent = null;
    this.eventDragging = false;
  }

  private onMouseMove() {
    if (this.eventDragging) {
      const draggingEventTop = this.$currentDraggingEvent.offset().top;
      const draggingEventBottom = this.$currentDraggingEvent.offset().top + this.$currentDraggingEvent.outerHeight();
      let topSlotIndex;
      let bottomSlotIndex;

      this.$timeSlots.each(function() {
        const $el = $(this);
        const elY = $el.offset().top;
        if (elY <= draggingEventTop && draggingEventTop <= (elY + $el.outerHeight())) {
          topSlotIndex = $el.index() + 1;
          return false;
        }
      });

      this.$timeSlots.each(function() {
        const $el = $(this);
        const elY = $el.offset().top;
        if (elY >= draggingEventBottom && (elY - $el.outerHeight()) <= draggingEventBottom) {
          bottomSlotIndex = $el.index() + 1;
          return false;
        }
      });

      const fromMinsTotal = 15 * topSlotIndex;
      const toMinsTotal = 15 * bottomSlotIndex;

      this.$currentDraggingEvent.find('.wc-time').text(`from: ${this.getTimeString(fromMinsTotal)} to ${this.getTimeString(toMinsTotal)}`);
    }
  }

  private getTimeString(timeSlotIndex) {
    const seconds = 15 * timeSlotIndex * 60;
    const hours   = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (hours * 3600)) / 60);

    // if (hours   < 10) {hours   = '0' + hours; }
    // if (minutes < 10) {minutes = '0' + minutes; }

    return `${hours}:${minutes}`;
  }

  public setValue(value) {
    this.$calendar.weekCalendar('gotoDate', value);
  }

}
