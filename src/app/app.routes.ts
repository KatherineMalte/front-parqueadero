import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { EntryPage } from './pages/entry/entry.page';
import { ActivePage } from './pages/active/active.page';
import { ExitPage } from './pages/exit/exit.page';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPage },
  { path: 'entry', component: EntryPage },
  { path: 'active', component: ActivePage },
  { path: 'exit', component: ExitPage },
  { path: '**', redirectTo: 'dashboard' }
];
