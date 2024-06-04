import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
// import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {
  apiUri = '/Ciprianis';
  token: String = this.authenticationService.getToken() || "";
  idUsuario = this.authenticationService.getIdUsuario();
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getReservaciones(): Observable<any> {
    console.log(this.idUsuario)
    const token: String = this.authenticationService.getToken() || "";
    return this.http.get(this.apiUri + `/reservas/${this.idUsuario}`, {
      headers:
      {
        'Content-Type': 'application/json',
        'access-token': `${this.token}`
      }
    });
  }

  // getDecodedToken(): any {
  //   const token = this.token;
  //   if (token) {
  //     return jwt_decode(token);
  //   }
  //   return null;
  // }

  // getUsuario(): string | null {
  //   const decodedToken = this.getDecodedToken();
  //   if (decodedToken && decodedToken.name) {
  //     return decodedToken.name;
  //   }
  //   return null;
  // }

}