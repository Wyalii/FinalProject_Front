import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignInComponent } from '../app/sign-in/sign-in.component';
import { RegisterComponent } from '../app/register/register.component';
import { EmailVerificationComponent } from '../app/verify-email/verify-email.component';
import { SearchResultsComponent } from '../app/search-results/search-results.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'SignIn', component: SignInComponent },
  {path: 'Register', component: RegisterComponent},
  {path: 'verify-email', component: EmailVerificationComponent},
  { path: 'search-results', component: SearchResultsComponent },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: '**', redirectTo: 'register' }
//   { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) }
];