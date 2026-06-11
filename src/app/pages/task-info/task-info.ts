import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Navigation } from '../../services/navigation';
import { TaskService, Task } from '../../services/task';
import { formatToDisplay } from '../../shared/utils/date.utils'

@Component({
  selector: 'app-task-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-info.html',
  styleUrl: './task-info.css',
})
export class TaskInfo implements OnInit {
  task!: Task;
  formatToDisplay = formatToDisplay;

  constructor(
    public routerNav: Navigation,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.taskService.tasks$.subscribe(tasks => {
      const found = tasks.find(t => t.id === id);
      if (found) {
        this.task = found;
      }
    });
  }

  deleteTask(id: string) {
    const date = this.task.date;
    //brise task sa datim id-em iz niza
    this.taskService.deleteTask(id);

    //iz niza taskService metodom getCurrentTask preuzmi njegove vrednosti i pronadji ga po id
    const remaining = this.taskService.getCurrentTask().filter(t => t.date === date);
    
    if (remaining.length === 0) {
      //u slucaju da je poslednji task u nizu i ovbrise se da se rutira na home stranicu
      this.routerNav.openHome();
    } else {
      //u slucaju da se obrise task a postoji jos taskova u nizu da se rutira na stranicu tog dana sa ostalim taskovima
      this.routerNav.openDay(date);
    }
  }
}