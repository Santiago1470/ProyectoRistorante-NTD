import { Component, OnInit } from '@angular/core';
import { MenuristoranteService } from 'src/app/services/menuristorante.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CarritoComponent } from '../carrito/carrito.component';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-gestionmenu',
  templateUrl: './gestionmenu.component.html',
  styleUrls: ['./gestionmenu.component.css']
})
export class GestionmenuComponent implements OnInit {
  platosList: any = [];
  categoriasList: any = [];
  platosXCategoriaList: any = [];
  modalAbierto = false;
  modalAbiertoAgregar = false;
  platoEditado: any = null;
  platoAgregado: any = null;
  tokenadmin: string = this.authenticationService.getToken() || "";
  modalAbiertoCarrito: boolean = false;
  platoCarrito: any = null;
  cantidad: number = 1;

  constructor(
    private menuristoranteService: MenuristoranteService,
    private toastr: ToastrService,
    public authenticationService: AuthenticationService,
    private pedidoService: PedidosService
  ) { }

  ngOnInit() {
    this.getAllPlatos();
  }

  getAllPlatos() {
    this.menuristoranteService.getAllPlatosData().subscribe(
      (data: any) => {
        this.platosXCategoriaList = data;
      },
      (error: any) => {
        console.error('Error al obtener platos:', error);
        this.toastr.error('Error al obtener platos');
      }
    );
  }

  consultarPlatosPorCategoria(categoria: string) {
    this.menuristoranteService.getAllplatosXCategoriaData(categoria).subscribe(
      (data: any) => {
        this.platosXCategoriaList = data;
        console.log(`Platos de la categoría ${categoria}:`, this.platosXCategoriaList);
      },
      (error: any) => {
        console.error('Error al consultar platos por categoría:', error);
        this.toastr.error('Error al consultar platos por categoría');
      }
    );
  }


  abrirModalAgregar() {
    this.platoAgregado = { nombre: '', descripcion: '', precio: null, imagen: '' };
    this.modalAbiertoAgregar = true;
  }

  abrirModal(plato: any) {
    this.platoEditado = { ...plato };
    this.modalAbierto = true;
    console.log(this.modalAbierto)
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.platoEditado = null;
  }

  cerrarModalAgregar() {
    this.modalAbiertoAgregar = false; // Utiliza modalAbiertoAgregar en lugar de modalAbierto
    this.platoAgregado = null;
  }

  guardarPlato() {
    console.log(this.platoEditado)
    const token = this.authenticationService.getToken();
    if (token === null) {
      this.toastr.error('Error: Token de autenticación no encontrado');
      return;
    }
    console.log(this.tokenadmin)
    const platoId = this.platoEditado._id;

    this.menuristoranteService.updatePlato(this.tokenadmin, platoId, this.platoEditado)
      .subscribe(
        (response: any) => {
          console.log('Plato actualizado:', response);
          this.getAllPlatos();
          this.cerrarModal();
        },
        (error: any) => {
          console.error('Error al actualizar el plato:', error);
          this.toastr.error('Error al actualizar el plato');
        }
      );
  }

  guardarPlatoAgregar() {
    console.log(this.platoAgregado)
    const token = this.authenticationService.getToken();
    if (token === null) {
      this.toastr.error('Error: Token de autenticación no encontrado');
      return;
    }

    this.menuristoranteService.createPlato(this.tokenadmin, this.platoAgregado)
      .subscribe(
        (response: any) => {
          console.log('Plato creado:', response);
          this.getAllPlatos();
          this.cerrarModalAgregar();
        },
        (error: any) => {
          console.error('Error al crear el plato:', error);
          this.toastr.error('Error al crear el plato');
        }
      );
  }

  eliminarPlato() {
    const token = this.authenticationService.getToken();
    if (token === null) {
      this.toastr.error('Error: Token de autenticación no encontrado');
      return;
    }

    const platoId = this.platoEditado._id;

    this.menuristoranteService.deletePlato(this.tokenadmin, platoId)
      .subscribe(
        (response: any) => {
          console.log('Plato eliminado:', response);
          this.getAllPlatos();
          this.cerrarModal();
        },
        (error: any) => {
          console.error('Error al eliminar el plato:', error);
          this.toastr.error('Error al eliminar el plato');
        }
      );
  }


  abrirModalCarrito(plato: any) {
    this.platoCarrito =  { ...plato };
    this.modalAbiertoCarrito = true;
  }

  cerrarModalCarrito() {
    this.modalAbiertoCarrito = false;
  }


  aumentarCantidad() {
    this.cantidad++;
  }

  disminuirCantidad() {
    if (this.platoAgregado.cantidad > 1) {
      this.cantidad--;
    }
  }

  agregarAlCarrito() {
    const token = this.authenticationService.getToken();
    if (token === null) {
      this.toastr.error('Error: Token de autenticación no encontrado');
      return;
    }
    const pedido = {
      plato: this.platoCarrito._id,
      estado: 'pendiente',
      cantidad: this.cantidad
    };
    this.pedidoService.newPedido(token, pedido)
      .subscribe(
        (response: any) => {
          this.cerrarModal();
        },
        (error: any) => {
        }
      );
  }





}