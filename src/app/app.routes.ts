import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

export const routes: Routes = [{ path: '', component: LandingPageComponent },{path :'CartPage', component: CartPageComponent}];
