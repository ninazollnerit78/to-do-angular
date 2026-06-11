import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Navigation } from '../../services/navigation';
import { TaskService, Task } from '../../services/task';
import { formatToISO } from '../../shared/utils/date.utils';

@Component({
  selector: 'app-daily-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-tasks.html',
  styleUrl: './daily-tasks.css',
})
export class DailyTasks implements OnInit {
  dayLabel: string = '';
  fullDate: string = '';
  dailyTasks: Task[] = [];

  constructor(
    public routerNav: Navigation,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    //uzimanje datuma iz url-a
    const date = this.route.snapshot.paramMap.get('date');
    if (!date) return;

    this.formatTitle(date);

    this.taskService.tasks$.subscribe(tasks => {
      this.dailyTasks = tasks.filter(task => task.date === date);
    });
  } 

  //title format
  formatTitle(date: string): void {
    const d = new Date(date);
    this.fullDate = d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const today = formatToISO(new Date());
    if (date === today) {
      this.dayLabel = 'Today'
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date === formatToISO(tomorrow)) {
      this.dayLabel = 'Tomorrow';
      return;
    }

    this.dayLabel = d.toLocaleDateString('en-US', {
      weekday: 'long'
    });
  }

  //poziv delet funkcije iz servisa za brisanje taska sa datim id-em
  deleteTask(id: string) {
    //iz niza taskService, metodom deleteTask obrisi task sa datim id-em koji se prosledjuje
    this.taskService.deleteTask(id);

    //this.route - angular servis koji daje info o trenutnoj url ruti
    //snapshot - uzmi stanje url u ovom trenutku i prestani dalje pracenje url-a (ne reaguj na promene samo procitaj jednom)
    //paramMap - mapa (key-value) svih parametara iz url-a
    const date = this.route.snapshot.paramMap.get('date');
    if(!date) return;

    //uzmi sve taskove i filtriraj samo one za dati datum
    const remaining = this.taskService.getCurrentTask().filter(t => t.date === date);
    if (remaining.length === 0) {
      this.routerNav.openHome();
    }
  }
}