import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos.service';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  pedidosList: any = [];

  constructor(private pedidosService: PedidosService,
    private router: Router) { 

    }
  
  ngOnInit() {
    this.getMisPedidos(); 
  }

  getMisPedidos() {
    this.pedidosService.getMisPedidos().subscribe(
      (data: any[]) => {
        if(data.length > 0){
          this.pedidosList = data[0].platos;
          console.log(this.pedidosList);
        }
      }
    );
  }
}
