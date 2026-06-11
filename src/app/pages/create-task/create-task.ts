import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TimePicker } from '../../components/time-picker/time-picker';
import { TaskService, Task } from '../../services/task';
import { formatToISO } from '../../shared/utils/date.utils';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

export type TaskPriority = 'high' | 'medium' | 'low';
@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatFormFieldModule, TimePicker ],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})

export class CreateTask {
  //medium je default state
  task: Task = {
    id: crypto.randomUUID(),
    name: '',
    date: '',
    time: '',
    priority: 'medium',
    note: ''
  }

  todayPlaceholder: string = '';
  timePlaceholder: string = '';
  isEditMode: boolean = false;

  private sub!: Subscription;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  //definisanje default date i time, kako bi imalo sta da se posalje ukoliko se ne izabere od strane korisnika
  // ngOnIinit() {
  //   const today = new Date();
  //   //ispis u inputu default
  //   this.todayPlaceholder = `Today, ` + this.formatToISO(today);
  //   //date mora da posalje info u formatu 2026-05-2026, split sece ceo ovaj niz 2026-05-06T10:15:30.000Z
  //   // this.task.date = today.toISOString().split('T')[0];
  //   this.task.date = formatToISO(today);

  //   this.task.time = '08:00';
  //   this.timePlaceholder = this.task.time;
  // }

  //definisanje default date i time, kako bi imalo sta da se posalje ukoliko se ne izabere od strane korisnika
  //create i edit mode
  ngOnInit() {
    const today = new Date();
    const id = this.route.snapshot.paramMap.get('id');

    //create mode
    if (!id) {
      this.isEditMode = false;
      //date mora da posalje info u formatu 2026-05-2026, split sece ceo ovaj niz 2026-05-06T10:15:30.000Z
      this.task.date = formatToISO(today);
      this.task.time = '08:00';
      //ispis u inputu default
      this.todayPlaceholder = `Today, ` + formatToISO(today);
      this.timePlaceholder = this.task.time;
      return
    }

    //edit mode
    this.isEditMode = true;
    this.sub = this.taskService.tasks$.subscribe(tasks => {
      const existing = tasks.find(t => t.id === id);
      if (existing) {
        this.task = { ...existing };
        this.todayPlaceholder = formatToISO(new Date(existing.date));
        this.timePlaceholder = existing.time;
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  setPriority(value: TaskPriority) {
   this.task.priority = value;
  }

  createTask() {
    //addTask metoda iz task service fajla
    this.taskService.addTask({
      ...this.task,
      id: crypto.randomUUID(),
      name: this.capitalize(this.task.name)
    });

    const today = new Date();
    this.task = {
      id: crypto.randomUUID(),
      name: '',
      date: formatToISO(today),
      time: '08:00',
      priority: 'medium',
      note: ''
    };
    this.todayPlaceholder = `Today, ${formatToISO(today)}`;
    this.timePlaceholder = '08:00';
  }

  //edit
  updateTask() {
    this.taskService.updateTask({
      ...this.task,
      name: this.capitalize(this.task.name)
    });
    //nakon update-a taska odlazak na njegovu stranicu (task-info)
    this.router.navigate(['/info', this.task.id]);
  }

  capitalize(text: string): string {
    if (!text) return '';
    const cleaned = text.trim().toLocaleLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  onDateChange(event: any) {
    const date = event.value;
    if (!date) return;
    //za slanje u niz
    this.task.date = formatToISO(date);
    this.todayPlaceholder = formatToISO(date);
  }

  onTimeSelected(time: string) {
    this.task.time = time;
  }

  // formatDate(date: Date): string {
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const year = date.getFullYear();
  //   return `${day}.${month}.${year}`;
  // }

  isFormValid(): boolean {
    //!! pretvara bilo koju vrednost u boolean
    return !!this.task.name && !!this.task.time;
  }
}