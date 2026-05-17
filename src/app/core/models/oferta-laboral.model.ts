export interface OfertaLaboral {
  idOferta?: number;
  titulo: string;
  descripcion?: string;
  area?: string;
  salario?: number;
  modalidad?: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
  fechaPublicacion?: string;
  fechaCierre?: string;
  estado?: boolean;
  empresa?: any;
  idEmpresa?: number;
}
