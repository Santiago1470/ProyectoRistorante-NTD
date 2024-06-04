import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuristoranteService } from 'src/app/services/menuristorante.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-gestionmenu',
  templateUrl: './gestionmenu.component.html',
  styleUrls: ['./gestionmenu.component.css']
})
export class GestionmenuComponent {
  platosList: any = [];
  categoriasList: any = [];
  platosXCategoriaList: any = [];
  

  constructor(private menuristoranteService: MenuristoranteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    public authenticationService: AuthenticationService) {
    

  }
  ngOnInit() {
    this.getAllPlatos();
    
  }


  getAllPlatos() {
    this.menuristoranteService.getAllPlatosData().subscribe(
      (data: {}) => {
        this.platosXCategoriaList = data
      }
    );
  }

  getAllCategorias() {
    this.menuristoranteService.getAllCategoriasData().subscribe(
      (data: {}) => {
        this.categoriasList = data
      }
    );
  }

  
  consultarPlatosPorCategoria(categoria: string) {
    console.log("categoria:" +categoria)
    this.menuristoranteService.getAllplatosXCategoriaData(categoria).subscribe(
      (data: {}) => {
        this.platosXCategoriaList = data
      }
    );
  }

}
