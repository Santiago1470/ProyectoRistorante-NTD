import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuristoranteService {
  apiUri = '/Ciprianis';

  constructor(private http: HttpClient) { }

  getAllPlatosData(): Observable<any> {

    return this.http.get(this.apiUri +
      "/platos", {
      headers:
      {
        'Content-Type': 'application/json'
      }
    });
  }

  getAllCategoriasData
    (): Observable<any> {

    return this.http.get(this.apiUri + "/categorias", {
      headers:
      {
        'Content-Type': 'application/json'
      }
    });
  }


  getAllplatosXCategoriaData
    (categoria: string): Observable<any> {
    console.log("categoria en servicio "
      + categoria
    )
    return this.http.get(this.apiUri + "/platosXCategorias" + "/" + categoria, {
      
      headers:
      {
        'Content-Type': 'application/json',
        
      }
    });
  }

  newAnimal(token: any, data: any): Observable<any> {
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

  updateAnimal(token: any, id: any, data: any): Observable<any> {
    console.log(data)
    return this.http.put<any>(
      this.apiUri + '/' + id,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  getOneAnimal(token: any, id: any): Observable<any> {
    return this.http.get<any>(
      this.apiUri + '/' + id,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

  deleteAnimal(token: any, id: any) {
    return this.http.delete<any>(
      this.apiUri + "/" + id,
      {
        headers: {
          'Content-Type': 'application/json',
          accessToken: `${token}`
        }
      });
  }

}
