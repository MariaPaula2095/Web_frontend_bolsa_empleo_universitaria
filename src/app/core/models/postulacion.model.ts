export interface Postulacion {
  idPostulacion?: number;
  fechaPostulacion?: string;
  estado?: 'PENDIENTE' | 'EN_REVISION' | 'ACEPTADA' | 'RECHAZADA';
  usuario?: any;
  ofertaLaboral?: any;
}
