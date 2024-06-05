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
  esAdmin: boolean = this.authenticationService.esAdministrador();
  reservacionesActivas: boolean = false;
  reservacionId: String = "";
  reserva: any = [];
  mostrarFormModificar: boolean = false;
  idClienteModificar: string = "";
  
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
    if (this.autenticado) {
      if (this.esAdmin) {
        this.getReservasAdmin();
      } else {
        this.getAllReservaciones();
      }

    } else {
      this.mostrarFormulario = true;
    }

  }

  getReservasAdmin() {
    this.reservacionService.getReservasAdmin().subscribe(
      (data: {}) => {
        this.reservacionesList = data
        console.log(this.reservacionesList);
        if (this.reservacionesList.length > 0) {
          this.mostrarFormulario = false;
          this.reservacionesActivas = true;
        } else {
          this.mostrarFormulario = true;
          this.reservacionesActivas = false;
        }
      }
    );
  }

  getAllReservaciones() {
    this.reservacionService.getReservaciones().subscribe(
      (data: {}) => {
        this.reservacionesList = data
        console.log(this.reservacionesList)
        if (this.reservacionesList.length > 0) {
          this.mostrarFormulario = false;
          this.reservacionesActivas = true;
        } else {
          this.mostrarFormulario = true;
          this.reservacionesActivas = false;
        }
      }
    );
  }

  getReservacion(id: String) {
    this.reservacionService.getReservacion(id).subscribe(
      (data: {}) => {
        this.reserva = data;
        console.log(this.reserva)
        if (!this.esAdmin) {
          this.nombreCliente = this.reserva.nombreCliente.nombre
          this.numeroPersonas = this.reserva.numeroPersonas
          this.mesa = this.reserva.mesa

          const fechaUTC = new Date(this.reserva.fecha);
          const fechaLocal = new Date(fechaUTC.getUTCFullYear(), fechaUTC.getUTCMonth(), fechaUTC.getUTCDate());

          this.fecha = this.datePipe.transform(fechaLocal, 'yyyy-MM-dd') || "";
          this.hora = this.reserva.hora
          console.log(this.reserva);
        } else {
          console.log(this.reserva.nombreCliente._id)
          this.idClienteModificar = this.reserva.nombreCliente._id
          this.nombreCliente = this.reserva.nombreCliente.nombre
          this.numeroPersonas = this.reserva.numeroPersonas
          this.mesa = this.reserva.mesa
          console.log(this.reserva.fecha)

          const fechaUTC = new Date(this.reserva.fecha);
          const fechaLocal = new Date(fechaUTC.getUTCFullYear(), fechaUTC.getUTCMonth(), fechaUTC.getUTCDate());

          this.fecha = this.datePipe.transform(fechaLocal, 'yyyy-MM-dd') || "";
          console.log(this.fecha)
          this.hora = this.reserva.hora
          console.log(this.reserva);
        }
        console.log(data);
        this.reservacionId = id;
        
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

  modificarReserva(form: any) {
    console.log(this.reservacionId)
    if(!this.esAdmin){
      form.value.nombreCliente = this.authenticationService.getIdUsuario();
    } else {
      console.log(this.idClienteModificar)
      form.value.nombreCliente = this.idClienteModificar;
    }
    
    this.reservacionService.modificarReserva(this.reservacionId, form.value).subscribe(
      (res) => {
        // localStorage.setItem('accessToken',JSON.parse(JSON.stringify(res)).token);
        this.mostrarFormModificar = false;
        this.mostrarFormulario = false;
        window.location.reload();
      }
    )
  }

  reservar(form: any) {
    form.value.nombreCliente = this.authenticationService.getIdUsuario();
    this.reservacionService.reservar(form.value).subscribe(
      (res) => {
        // localStorage.setItem('accessToken',JSON.parse(JSON.stringify(res)).token);
        this.mostrarFormulario = false;
        window.location.reload();
      }
    )
  }

  mostrarForm() {
    this.mostrarFormulario = true;
  }

  cancelar() {
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

  cancelarReserva(id: any) {
    this.reservacionService.cancelarReserva(id).subscribe(
      (res) => {
        window.location.reload();
      }
    )
  }

  verificarAutenticacion() {
    if (!this.autenticado) {
      this.router.navigate(['/login']);
    }
  }
}
