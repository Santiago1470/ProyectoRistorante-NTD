import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { GestionmenuComponent } from './components/gestionmenu/gestionmenu.component';
import { ReservacionComponent } from './components/reservacion/reservacion.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { InformationComponent } from './components/information/information.component';

const routes: Routes = [
  {path: '',component: InicioComponent},
  {path: 'signup',component: SignupComponent},
  {path: 'login',component: LoginComponent},
  {path: 'logout',component: AppComponent},
  {path: 'menu',component: MenuComponent},
  {path: 'inicio',component: InicioComponent},
  {path: 'gestionmenu',component: GestionmenuComponent},
  {path: 'reservacion', component: ReservacionComponent},
  {path: 'carrito', component: CarritoComponent},
  {path: 'info', component: InformationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
