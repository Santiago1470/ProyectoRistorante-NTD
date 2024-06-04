import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReservacionService } from 'src/app/services/reservacion.service';

@Component({
  selector: 'app-reservacion',
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css']
})
export class ReservacionComponent {
  reservacionesList: any = [];
  mostrarFormulario: boolean = false;
  // reserva: any = {};
  // modificar: boolean = false;
  // formulario: FormGroup = this.formBuilder.group({
  //   nombreCliente: '',
  //   numeroPersonas: 0,
  //   mesa: 0,
  //   fecha: '',
  //   hora: ''
  // });;

  constructor(private reservacionService: ReservacionService,
    private authenticationService: AuthenticationService,
    private router: Router) { 
      
    }

    ngOnInit() {
      this.getAllReservaciones();
      
    }

    getAllReservaciones() {
      console.log(this.reservacionesList)
      this.reservacionService.getReservaciones().subscribe(
        (data: {}) => {
          this.reservacionesList = data
          console.log(data)
        }
      );
    }

    reservar(form: any){
      form.value.nombreCliente = this.authenticationService.getIdUsuario();
      this.reservacionService.reservar(form.value).subscribe(
        (res) => {
          // localStorage.setItem('accessToken',JSON.parse(JSON.stringify(res)).token);
          this.mostrarFormulario = false;
          window.location.reload();
        }
      )
    }

    mostrarForm(){
      this.mostrarFormulario = true;
    }

    cancelar(){
      this.mostrarFormulario = false;
    }

    // modificarReserva(form: any){

    //   form.value.nombreCliente = this.authenticationService.getIdUsuario();
    //   this.reservacionService.modificarReserva(form.value).subscribe(
    //     (res) => {
    //       // localStorage.setItem('accessToken',JSON.parse(JSON.stringify(res)).token);
    //       this.mostrarFormulario = false;
    //       this.modificar = false;
    //       window.location.reload();
    //     }
    //   )
    // }

    cancelarReserva(id: any){
      this.reservacionService.cancelarReserva(id).subscribe(
        (res) => {
          window.location.reload();
        }
      )
    }
}
