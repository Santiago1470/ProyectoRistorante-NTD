import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  autenticacion: boolean = false;
  constructor(private authService: AuthenticationService) {
    this.autenticacion = this.authService.isLoggedIn();
  }
  
  logout() {
    this.authService.logout();
  }
}