import { Routes } from '@angular/router';
import { ShellComponent } from './pages/shell-component/shell-component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard — JobRadar',
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./pages/add-job/add-job.component').then(m => m.AddJobComponent),
        title: 'Add Job — JobRadar',
      },
      {
        path: 'job/:id',
        loadComponent: () =>
          import('./pages/job-details/job-details.component').then(m => m.JobDetailsComponent),
        title: 'Job Details — JobRadar',
      },
      { path: '**', redirectTo: '' },
    ],
  },
];