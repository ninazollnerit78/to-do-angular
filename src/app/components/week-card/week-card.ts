import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TaskService, Task } from '../../services/task';
import { formatToISO } from '../../shared/utils/date.utils';
import { Router } from '@angular/router';

type Day = {
  name: string;
  date: string;
  fullDate?: string;
  isCurrentMonth?: boolean;
  tasks?: Task[];
};

@Component({
  selector: 'app-week-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-card.html',
  styleUrl: './week-card.css',
})
  
export class WeekCard {
  currentDate: Date = new Date();
  currentMonth: string[] = [];
  isExpanded: boolean = false;
  weekDays: Day[] = [];
  monthDays: Day[] = [];
  todayTitle: string = '';
  animationClass: string = '';
  taskMap: { [date: string]: Task[] } = {};
  private sub!: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private taskService: TaskService,
    private router: Router
  ) {}
  //poziv po ucitavanju stranice
  ngOnInit() {
    this.generateWeek();
    //poziv updateFromTask metode i subscribe
    this.sub = this.taskService.tasks$.subscribe(tasks => this.updateFromTask(tasks));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private updateFromTask(tasks: any[]) {
    this.taskMap = {};
    tasks.forEach(task => {
      if (!this.taskMap[task.date]) {
        this.taskMap[task.date] = [];
      }
      this.taskMap[task.date].push(task);
    });
    this.generateWeek();
  }

  //generisanje nedelje
  generateWeek() {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    this.weekDays = [];

    for(let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);

      const formattedDate = formatToISO(day);
      const tasksForDay = this.taskMap[formattedDate] ?? [];

      this.weekDays.push({
        name: day.toLocaleDateString('en-US', {weekday: 'short'}).charAt(0),
        date: day.getDate().toString(),
        fullDate: formatToISO(day),
        tasks: tasksForDay.slice(0, 3)
      });
    }

    //kreiranje danasnjeg datuma, rucni zapis (monday 4, may)
    // toLocaleDateString ugradjena js metoda na Date objektu koja vraca formu datuma kao string (samo datum bez sata)
    const d = new Date();
    this.todayTitle = `${d.toLocaleDateString('en-US', {weekday: 'long'})} ${d.getDate()}, ${d.toLocaleDateString('en-US', {month: 'short'})}`;
    //ispis title meseca
     this.setWeekTitle(startOfWeek);
  }
  
  generateMonthDays() {
    const date = new Date(this.currentDate);
    date.setDate(1); //prvi u mesecu
    this.monthDays = [];
    const month = date.getMonth();

    //nalazenje ponedeljka
    const dayOfWeek = date.getDay(); //0 - nedelja, 1 - ponedeljak
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    date.setDate(date.getDate() + diffToMonday);
    
    for(let i = 0; i < 42; i++) {
      const day = new Date(date);
      day.setDate(date.getDate() + i);

      const formattedDate = formatToISO(day);
      const taskForDay = this.taskMap[formattedDate] ?? [];

      this.monthDays.push({
        name: day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        date: day.getDate().toString(),
        fullDate: formatToISO(day),
        isCurrentMonth: day.getMonth() === month,
        tasks: taskForDay.slice(0, 3)
      });
    }
    this.updateMonthTitle();
  }
  
  toggleMonth() {
    this.isExpanded = !this.isExpanded;
    if(this.isExpanded) {
      this.generateMonthDays();
    } else {
       this.generateWeek(); 
    }
  }
  
  updateMonthTitle() {
    const d = new Date(this.currentDate);
    this.currentMonth = [
      d.toLocaleDateString('en-US', { month: 'long' }),
      d.getFullYear().toString()
    ];
  }
  
  //racunanje pocetka nedelje
  getStartOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(date); monday.setDate(date.getDate() + diffToMonday);
    return monday;
  }
  
  //racunanje prethodne nedelje
  previousWeek() {
    this.animationClass = 'slide_right';

    setTimeout(() => {
      this.currentDate = new Date(this.currentDate);
      
      if(this.isExpanded) {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      } else {
        this.currentDate.setDate(this.currentDate.getDate() - 7);
      }
      this.generateWeek();

      if(this.isExpanded) {
        this.generateMonthDays();
      }
      
      this.animationClass = '';
      this.cdr.detectChanges();
    }, 300);
  }
  
  //racunanje naredne nedelje
  nextWeek() {
    this.animationClass = 'slide_left';
    
    setTimeout(() => {
      this.currentDate = new Date(this.currentDate);
      
      if(this.isExpanded) {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      } else {
        this.currentDate.setDate(this.currentDate.getDate() + 7);
      }
      this.generateWeek();

      if(this.isExpanded) {
        this.generateMonthDays();
      }
      
      this.animationClass = ''; this.cdr.detectChanges();
    }, 300);
  }

  setWeekTitle(startOfWeek: Date) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'long' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'long' });
    const year = startOfWeek.getFullYear();

    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      this.currentMonth = [`${startMonth} ${year}`];
    } else {
      this.currentMonth = [`${startMonth} - ${endMonth} ${year}`];
    }
  }

  //navigacija na stranicu sa dnevnim taskovima (ukoliko dan ima taskova, u suprotnom vodi na create task stranicu)
  onDayClick(day: Day) {
    if(day.tasks?.length) {
      this.router.navigate(['/daily', day.fullDate]);
    } else {
      this.router.navigate(['/task']);
    }
  }
}