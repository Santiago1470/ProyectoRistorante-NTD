import { Component, Inject } from '@angular/core';
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

  constructor(private reservacionService: ReservacionService,
    private router: Router) { 

    }

    ngOnInit() {
      this.getAllReservaciones();
      
    }

    getAllReservaciones() {
      this.reservacionService.getReservaciones().subscribe(
        (data: {}) => {
          this.reservacionesList = data
          console.log(data)
        }
      );
    }
}
