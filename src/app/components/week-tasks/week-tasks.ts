import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService, Task } from '../../services/task';
import { formatToISO } from '../../shared/utils/date.utils';
import { Navigation } from '../../services/navigation';

type TaskGroup = {
  label: string;
  date: string;
  isoDate: string;
  tasks: Task[];
  expanded?: boolean;
};

@Component({
  selector: 'app-week-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-tasks.html',
  styleUrl: './week-tasks.css',
})
export class WeekTasks implements OnInit, OnDestroy {
  private sub!: Subscription;

  tasks: Task[] = [];
  weekTaskGroups: TaskGroup[] = [];

  constructor(
    private taskService: TaskService,
    private router: Router,
    public routerNav: Navigation
  ) {}

  ngOnInit() {
    this.sub = this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.buildWeekGroups();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  //grupisanje u 7 dana
  buildWeekGroups() {
    const today = new Date();
    // this.weekTaskGroups = [];
    const groups: TaskGroup[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const iso = formatToISO(date);
      const dayTasks = this.tasks.filter(t => t.date === iso);

      if (dayTasks.length > 0) {
        groups.push({
          label: this.getLabel(i),
          date: this.formatDisplayDate(date),
          isoDate: iso,
          tasks: dayTasks
        });
      }
    }
    this.weekTaskGroups = groups;
  }

  //label logika (today/tomorrow/day name)
  getLabel(index: number): string {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';

    const date = new Date();
    date.setDate(date.getDate() + index);

    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  //prikaz datuma
  formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  }

  //+ more tasks click
  expandedDay(day: TaskGroup) {
    day.expanded = !day.expanded;
  }
}