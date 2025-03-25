import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { RegisterComponent } from './pages/register/register.component';
import { EmailVerificationComponent } from './components/verify-email/verify-email.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

// import { CartPageComponent } from './pages/cart-page/cart-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  // { path: 'CartPage', component: CartPageComponent },
  { path: 'SignIn', component: SignInComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'verify-email', component: EmailVerificationComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: '**', redirectTo: '' },
];
