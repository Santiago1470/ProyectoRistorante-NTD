import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { MenuristoranteService } from 'src/app/services/menuristorante.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  pedidosList: any = [];
  token: String = this.authenticationService.getToken() || "";

  constructor(
    private pedidosService: PedidosService,
    private authenticationService: AuthenticationService,
    private platosService: MenuristoranteService
  ) { }


  ngOnInit(): void {
    this.getMisPedidos();
  }

  getMisPedidos() {
    this.pedidosService.getMisPedidos().subscribe(
      data => {
        this.pedidosList = data;
        this.obtenerDetallesPlatos();
        console.log(this.pedidosList[0])
      },
      error => {
        console.error(error);
      }
    );
  }

  obtenerDetallesPlatos() {
    const observables: Observable<any>[] = [];
    this.pedidosList.forEach((pedido: any) => {
      pedido.platos.forEach((plato: any) => {
        observables.push(this.platosService.getPlatoById(`${this.token}`, plato._id));
      });
    });
  
    forkJoin(observables).subscribe(
      (detalles: any[]) => {
        console.log("Detalles de platos recibidos:", detalles);
  
        this.pedidosList.forEach((pedido: any) => {
          pedido.detallesPlatos = [];
  
          pedido.platos.forEach((plato: any) => {
            const detalle = detalles.find(det => det && det._id === plato._id);
  
            if (detalle) {
              pedido.detallesPlatos.push(detalle);
            }
          });
  
          console.log("Detalles de platos para el pedido:", pedido.detallesPlatos);
        });
      },
      error => {
        console.error(`Error obteniendo detalles de los platos: ${error}`);
      }
    );
  }

  // obtenerDetallesPlatos() {
  //   this.pedidosList.forEach((pedido: any) => {
  //     console.log(pedido._id)
  //     this.platosService.getPlatoById(`${this.token}`, pedido.platos[0]._id).subscribe(
  //       (detalle: any) => {
  //         pedido.detallePlato = detalle;
  //         console.log(pedido.detallePlato)
  //       },
  //       error => {
  //         console.error(`Error obteniendo detalles del plato ${pedido.idPlato}: ${error}`);
  //       }
  //     );
  //   });
  // }

  // calcularTotal(): number {
  //   let total = 0;
  //   for (let pedido of this.pedidosList) {
  //     total += +pedido.detallePlato.precio * +pedido.cantidad;
  //   }
  //   return total;
  // }
}

