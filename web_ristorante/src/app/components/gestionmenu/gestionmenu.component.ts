import { Component, OnInit } from '@angular/core';
import { MenuristoranteService } from 'src/app/services/menuristorante.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

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
  platoEditado: any = null;
  tokenadmin: string = this.authenticationService.getToken() || "";

  constructor(
    private menuristoranteService: MenuristoranteService,
    private toastr: ToastrService,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getAllPlatos();
  }

  getAllPlatos() {
    this.menuristoranteService.getAllPlatosData().subscribe(
      (data: any) => {
        this.platosXCategoriaList = data;
        console.log('Platos obtenidos:', this.platosXCategoriaList);
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

  abrirModal(plato: any) {
    this.platoEditado = { ...plato };
    this.modalAbierto = true;
    console.log(this.modalAbierto)
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.platoEditado = null;
  }

  guardarPlato() {
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
}