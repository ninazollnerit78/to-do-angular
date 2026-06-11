import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Navigation {
  constructor(private router: Router) {}

  //funkcija za task lista page (svi taskovi za taj dan)
  openDay(date: string) {
    this.router.navigate(['/daily', date]);
  }

  //funkcija za task info page (info samo za jedan task)
  openTaskInfo(taskId: string) {
    this.router.navigate(['/info', taskId]);
  }

  //funkcija za edit task page
  openEdit(id: string) {
    this.router.navigate(['/task', id]);
  }

  openHome() {
    this.router.navigate(['/home']);
  }
}