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
  idUsuario = this.authenticationService.getIdUsuario();
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getMisPedidos(): Observable<any>{
    return this.http.get(`${this.apiUri}/carrito/mis-pedidos`, {
      headers:
      {
        'Content-Type': 'application/json',
        'access-token': `${this.token}`
      }
    });
  }

  newPedido(token: any, data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  getTodosPedidos() {
    return this.http.get(`${this.apiUri}/carrito`);
  }

  agregarPedido(platos: { plato: string; estado: string; cantidad: number }[]) {
    return this.http.post(`${this.apiUri}/carrito/agregar`, { platos });
  }

  eliminarPlatoDelCarrito(pedidoId: string, platoId: string) {
    return this.http.delete(`${this.apiUri}/carrito/${pedidoId}/plato/${platoId}`);
  }

  actualizarEstadoPlatoEnCarrito(pedidoId: string, platoId: string, nuevoEstado: string) {
    return this.http.put(`${this.apiUri}/carrito/${pedidoId}/plato/${platoId}`, { estado: nuevoEstado });
  }
}
