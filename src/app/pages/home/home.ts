import { Component } from '@angular/core';
import { WeekCard } from '../../components/week-card/week-card';
import { WeekTasks } from '../../components/week-tasks/week-tasks';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WeekCard, WeekTasks],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}