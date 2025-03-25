import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignInComponent } from '../app/sign-in/sign-in.component';
import { RegisterComponent } from '../app/register/register.component';
import { EmailVerificationComponent } from '../app/verify-email/verify-email.component';
import { SearchResultsComponent } from '../app/search-results/search-results.component';
// import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { ProductDetailComponent } from '../app/product-detail/product-detail.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  // { path: 'CartPage', component: CartPageComponent },
  { path: 'SignIn', component: SignInComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'verify-email', component: EmailVerificationComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: '' }
];