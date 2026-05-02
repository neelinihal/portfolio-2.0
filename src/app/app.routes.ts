import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Neeli Nihal — Backend & DevOps Engineer',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'About — Neeli Nihal',
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./pages/skills/skills.component').then((m) => m.SkillsComponent),
    title: 'Skills — Neeli Nihal',
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.component').then(
        (m) => m.ProjectsComponent
      ),
    title: 'Projects — Neeli Nihal',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
    title: 'Contact — Neeli Nihal',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
