import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuristoranteService {
  private apiUri = '/Ciprianis';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getAllPlatosData(): Observable<any> {
    return this.http.get(`${this.apiUri}/platos`, this.httpOptions);
  }

  getAllCategorias(): Observable<any> {
    return this.http.get(`${this.apiUri}/categorias`, this.httpOptions);
  }

  getAllplatosXCategoriaData(categoria: string): Observable<any> {
    return this.http.get(`${this.apiUri}/platosXCategorias/${categoria}`, this.httpOptions);
  }

  createPlato(token: string, platoData: any): Observable<any> {
    return this.http.post(`${this.apiUri}/platos`, platoData, {
      ...this.httpOptions,
      headers: this.httpOptions.headers.append('access-token', token)
    });
  }

  updatePlato(token: string, platoId: string, platoData: any): Observable<any> {
    return this.http.put(`${this.apiUri}/platos/${platoId}`, platoData, {
      ...this.httpOptions,
      headers: this.httpOptions.headers.append('access-token', token)
    });
  }

  getPlatoById(token: string, platoId: string): Observable<any> {
    console.log(`${this.apiUri}/platos/${platoId}`)
    return this.http.get(`${this.apiUri}/platos/${platoId}`, {
      ...this.httpOptions,
      headers: this.httpOptions.headers.append('access-token', token)
    });
  }

  deletePlato(token: string, platoId: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/platos/${platoId}`, {
      ...this.httpOptions,
      headers: this.httpOptions.headers.append('access-token', token)
    });
  }
}
