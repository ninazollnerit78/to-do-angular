import { Component, EventEmitter, HostListener, Output, ElementRef, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-picker.html',
  styleUrl: './time-picker.css',
})
export class TimePicker {
  //salje izabrano vreme parent komponenti
  @Output() timeSelected = new EventEmitter<string>();

  //za click izvan time box-a da se zatvori
  @ViewChild('pickerBox') pickerBox!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if(!this.show) return;
    
    const target = event.target as HTMLElement;
    const clickedInput = target.closest('#input_time');
    const clickedButton = target.closest('.time_picker_btn');
    const clickedInsidePicker = this.pickerBox?.nativeElement.contains(target);

    if(!clickedInsidePicker && !clickedInput && !clickedButton) {
      this.close();
    }
  }
  constructor(private elementRef: ElementRef) {}

  show = false;
  hours: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minutes: string[] = ['00', '15', '30', '45'];
  selectedHour = '';
  selectedMinute = '';

  open() {
    this.show = true;
    //default
    this.selectedHour = this.selectedHour || '08';
    this.selectedMinute = this.selectedMinute || '00';
  }
  close() {
    this.show = false;
  }

  selectHour(h: string) {
    this.selectedHour = h;
  }

  selectMinute(m: string) {
    this.selectedMinute = m;
  }

  selectTime() {
    const hour = this.selectedHour || '08';
    const minute = this.selectedMinute || '00';
    const time = `${hour}:${minute}`;
    this.timeSelected.emit(time); //salje info parentu
    this.show = false;
  }
}