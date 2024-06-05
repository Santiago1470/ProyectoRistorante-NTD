import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Jwtres } from '../models/jwtres';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  apiUri = '/Ciprianis';
  authSubject = new BehaviorSubject(false);
  private token: string | null = '';
  private autenticacion: boolean = false;
  private idUsuario: String = "";
  private rolUsuario: string = '';

  constructor(private httpClient: HttpClient) { }

  register(user: User): Observable<Jwtres> {
    return this.httpClient.post<Jwtres>(this.apiUri + '/signup', user);
  }

  login(user: User): Observable<Jwtres> {
    return this.httpClient.post<Jwtres>(this.apiUri + '/login', user).pipe(
      catchError(error => {
        alert("Usuario y/o contraseña incorrecto.")
        return throwError(error);
      }),
      tap((res: Jwtres) => {
        if (res) {
          this.saveToken(JSON.parse(JSON.stringify(res)).token);
          console.log(this.idUsuario);
          this.isLoggedIn();
          // localStorage.setItem('accessToken',JSON.parse(JSON.stringify(res)).token);
          // console.log(this.token);
          //console.log(JSON.parse(JSON.stringify(res)).accessToken)
          //ACCESS_TOKEN: JSON.parse(JSON.stringify(res)).accessToken
          
        } else {
          console.log('hubo un error')
        }
      })

    )
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      return jwt_decode.jwtDecode(token);
    }
    return null;
  }

  getIdUsuario(): String {
    if(this.getDecodedToken() == null){
      this.idUsuario = "";
    } else {
      this.idUsuario = this.getDecodedToken()._id;
    }
    
    
    return this.idUsuario;
  }

  logout() {
    this.token = '';
    this.isLoggedIn();
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("EXPIRES_IN");
  }

  private saveToken(token: string/*, expiresIn: string*/) {
    localStorage.setItem("accessToken", token);
    // localStorage.setItem("EXPIRES_IN", token);
    this.token = token;
  }

  public getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("accessToken");
    }
    return this.token;
  }

  isLoggedIn(): boolean {
    if(this.getToken() == null){
      this.autenticacion = false;
    } else {
      this.autenticacion = true;
    }
    return this.autenticacion;
  }

  getRolUsuario(): string | null {
    const token = this.getToken();
    if (!token) {
      return null; 
    }
    const decodedToken: any = this.getDecodedToken();
    return decodedToken?.rol || null;
  }

  esAdministrador(): boolean {
    const rol = this.getRolUsuario();
    return rol === 'administrador';
  }

  esCliente(): boolean {
    const rol = this.getRolUsuario();
    return rol === 'cliente';
  }
}
