import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Reservacion } from 'src/app/models/reservacion';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReservacionService } from 'src/app/services/reservacion.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reservacion',
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.css'],
  providers: [DatePipe]
})
export class ReservacionComponent {
  reservacionesList: any = [];
  mostrarFormulario: boolean = false;
  autenticado: boolean = this.authenticationService.isLoggedIn();
  reservacionesActivas: boolean = false;
  reservacionId: String = "";
  reserva: any = [];
  mostrarFormModificar: boolean = false;
  
  nombreCliente: string = "";
  numeroPersonas: number = 0;
  mesa: number = 0;
  fecha: string = "";
  hora: string = "";

  constructor(private reservacionService: ReservacionService,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private router: Router) { 
      
    }

    ngOnInit() {
      console.log(this.autenticado)
      if(this.autenticado){
        this.getAllReservaciones();
      } else {
        this.mostrarFormulario = true;
      }
      
    }

    getAllReservaciones() {
      this.reservacionService.getReservaciones().subscribe(
        (data: {}) => {
          this.reservacionesList = data
          console.log(this.reservacionesList)
          if(this.reservacionesList.length > 0){
            this.mostrarFormulario = false;
            this.reservacionesActivas = true;
          } else {
            this.mostrarFormulario = true;
            this.reservacionesActivas = false;
          }
        }
      );
    }

    getReservacion(id: String){
      this.reservacionService.getReservacion(id).subscribe(
        (data: {}) => {
          this.reserva = data;
          this.nombreCliente = this.reserva[0].nombreCliente.nombre
          this.numeroPersonas = this.reserva[0].numeroPersonas
          this.mesa = this.reserva[0].mesa
          this.fecha = this.datePipe.transform(this.reserva[0].fecha, 'yyyy-MM-dd') || "";
          this.hora = this.reserva[0].hora
          console.log(data);
          this.reservacionId = id;
          console.log(this.reserva[0]);
          this.mostrarFormulario = true;
          this.mostrarFormModificar = true;
        }
      );
    }

    // cargarModificarReserva(idReservacion: String){
    //   this.reservacionId = idReservacion;
    //   this.getReservacion(idReservacion);
    //   console.log(this.reserva);
    //   this.mostrarFormulario = true;
    //   this.mostrarFormModificar = true;
    // }

    modificarReserva(form: any){
      console.log(this.reservacionId)
      form.value.nombreCliente = this.authenticationService.getIdUsuario();
      this.reservacionService.modificarReserva(this.reservacionId, form.value).subscribe(
        (res) => {
          // localStorage.setItem('accessToken',JSON.parse(JSON.stringify(res)).token);
          this.mostrarFormModificar = false;
          this.mostrarFormulario = false;
          window.location.reload();
        }
      )
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

    verificarAutenticacion() {
      if(!this.autenticado){
        this.router.navigate(['/login']);
      }
    }
}
