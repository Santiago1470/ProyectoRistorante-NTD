import { Component, OnInit } from '@angular/core';
import { PedidosService } from 'src/app/services/pedidos.service';
import { MenuristoranteService } from 'src/app/services/menuristorante.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
    private platosService: MenuristoranteService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getMisPedidos(); 
  }

  getMisPedidos() {
    this.pedidosService.getMisPedidos().subscribe(
      (data: any[]) => {
        if(data.length > 0){
          this.pedidosList = data[0].platos;
          this.obtenerDetallesPlatos();
        }
      }
    );
  }

  obtenerDetallesPlatos() {
    this.pedidosList.forEach((pedido: any) => {
      console.log(`${this.token}`)
      this.platosService.getPlatoById(`${this.token}`, pedido._id).subscribe(
        (detalle: any) => {
          pedido.detallePlato = detalle;
          console.log(pedido.detallePlato)
        },
        error => {
          console.error(`Error obteniendo detalles del plato ${pedido.idPlato}: ${error}`);
        }
      );
    });
  }

  calcularTotal(): number {
    let total = 0;
    for (let pedido of this.pedidosList) {
      total += +pedido.detallePlato.precio * +pedido.cantidad;
    }
    return total;
  }
}

