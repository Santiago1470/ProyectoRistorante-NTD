export interface Reservacion {
    reservacion: {
      nombreCliente: string,
      numeroPersonas: number,
      mesa: number,
      fecha: Date,
      hora: string,
      estado: string
    }
  
  }