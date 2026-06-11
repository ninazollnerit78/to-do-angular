import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CreateTask } from './pages/create-task/create-task'
import { DailyTasks } from './pages/daily-tasks/daily-tasks';
import { TaskInfo } from './pages/task-info/task-info';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: 'task',
        component: CreateTask
    },
    {
        path: 'task/:id',
        component: CreateTask
    },
    {
        path: 'daily/:date',
        component: DailyTasks
    },
    {
        path: 'info/:id',
        component: TaskInfo
    }
];
