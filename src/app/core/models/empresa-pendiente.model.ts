export interface EmpresaPendiente {
  idEmpresaPendiente?: number;
  nombre: string;
  email: string;
  password?: string;
  estado?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  mensaje?: string;
  rechazos?: number;
  activo?: boolean;
}
