import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  apiUri = '/Ciprianis';
  token: String = this.authenticationService.getToken() || "";
  //idUsuario = this.authenticationService.getIdUsuario();
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getMisPedidos(): Observable<any>{
    return this.http.get<any>(`${this.apiUri}/carrito/mis-pedidos`, {
      headers:
      {
        'Content-Type': 'application/json',
        'access-token': `${this.token}`
      }
    });
  }

  newPedido(token: any, data: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUri}/carrito/agregar`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'access-token': `${this.token}`
        }
      });
  }
  deletePedido( pedidoId: string, platoId:string): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUri}/carrito/${pedidoId}/plato/${platoId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'access-token': `${this.token}`
        }
      });
  }
}
