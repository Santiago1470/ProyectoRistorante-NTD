import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Reservacion } from '../models/reservacion';
import { Jwtres } from '../models/jwtres';
// import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ReservacionService {
  apiUri = '/Ciprianis';
  token: String = this.authenticationService.getToken() || "";
  idUsuario = this.authenticationService.getIdUsuario();
  autenticado: boolean = this.authenticationService.isLoggedIn();
  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) { }

  getReservaciones(): Observable<any> {
    return this.httpClient.get(this.apiUri + `/reservas/${this.idUsuario}`, {
      headers:
      {
        'Content-Type': 'application/json',
        'access-token': `${this.token}`
      }
    });
  }

  getReservacion(idReserva: String): Observable<any> {
    console.log(idReserva)
    return this.httpClient.get(this.apiUri + `/reservas/unidad/${idReserva}`, {
      headers:
      {
        'Content-Type': 'application/json',
        'access-token': `${this.token}`
      }
    });
  }

  modificarReserva(idReserva: String, reservacion: Reservacion): Observable<any> {
    return this.httpClient.put(this.apiUri + `/reservas/${idReserva}`, reservacion, {
      headers:
      {
        'Content-Type': 'application/json',
        'access-token': `${this.token}`
      }
    });
  }

  reservar(reservacion: Reservacion): Observable<any> {
    return this.httpClient.post<Jwtres>(this.apiUri + `/reservas`, reservacion, {
      headers:
      {
        'Content-Type': 'application/json',
        'access-token': `${this.token}`
      },
      
    }).pipe(
      catchError(error => {
        alert("Parece que ya tiene una reservación para ese día o el formulario no está debidamente diligenciado.")
        return throwError(error);
      }),
      tap((res: Jwtres) => {
        if (res) {
          
        } else {
          console.log('hubo un error')
        }
      })

    );
  }

  cancelarReserva(id: String){
    return this.httpClient.delete<Jwtres>(this.apiUri + `/reservas/${id}`, {
      headers:
      {
        'Content-Type': 'application/json',
        'access-token': `${this.token}`
      },
      
    });
  }

  // modificarReserva(reservacion: Reservacion){
  //   return this.httpClient.put<Jwtres>(this.apiUri + `/reservas`, reservacion, {
  //     headers:
  //     {
  //       'Content-Type': 'application/json',
  //       'access-token': `${this.token}`
  //     },
      
  //   }).pipe(
  //     catchError(error => {
  //       alert("Parece que ya tiene una reservación para ese día.")
  //       return throwError(error);
  //     }),
  //     tap((res: Jwtres) => {
  //       if (res) {
          
  //       } else {
  //         console.log('hubo un error')
  //       }
  //     })

  //   );
  // }

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