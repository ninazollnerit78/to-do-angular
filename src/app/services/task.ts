import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//exportuje se drugim fajlovima, interface definise oblik jednog taska
export interface Task {
  id: string;
  name: string,
  date: string,
  time: string, 
  priority: 'high' | 'medium' | 'low',
  note: string;
}

//service deo, jedna globalna instanca u celoj app (root)
@Injectable({
  providedIn: 'root',
})

export class TaskService {
  //privatno stanje, niz Taskova, pocetna vrednost je prazan niz [] - glavni storage taskova u app
  //BehaviorSubject tip subject-a koji cuva trenutnu vrednost i prosledjuje vrednost subscriber-ima
  //BehaviorSubject cuva niz objekata (lista taskova)
  //private - dostupna samo unutar ove klase
  private taskSubject = new BehaviorSubject<Task[]>([]);
  //pretvara subject u obican observable - asObservable() znaci da mogu gledati podatke ali ih ne mogu menjati
  //$ oznacava observable(steam podataka) - tok podataka kroz vreme, nemaju svi podaci odmah
  tasks$ = this.taskSubject.asObservable();

  getCurrentTask(): Task[] {
    //uzima vrednost taska iz niza taskSubject
    //taskSubject je BehaviorSubject sto znaci da uvek cuva trenutno stanje niza
    return this.taskSubject.value;
  }

  addTask(task: Task) {
    //uzima trenutni niz Taskova iz BehaviorSubject
    const currentTask = this.taskSubject.value;

    //next - posalji novu vrednost svima koji slusaju
    //... spread operator kopira sve postojece fajlove
    //task - dodaje novi task na kraju liste
    this.taskSubject.next([
      ...currentTask,
      task
    ]);
  }

  updateTask(updated: Task) {
    const current = this.taskSubject.value;
    this.taskSubject.next(
      current.map(t => t.id === updated.id ? updated : t) 
    );
  }

  deleteTask(id: string) {
    //uzima trenutni niz taskova - taskSubject
    const current = this.taskSubject.value;
    //izbacuje task sa prosledjenim id-em
    this.taskSubject.next(
      current.filter(task => task.id !== id)
    );
  }
}
