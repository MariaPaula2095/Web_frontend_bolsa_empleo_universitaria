export interface Usuario {
  idUsuario?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  tipoUsuario?: 'ESTUDIANTE' | 'ADMIN' | 'EMPRESA';
  fechaRegistro?: string;
  estado?: boolean;
  password?: string;
}
