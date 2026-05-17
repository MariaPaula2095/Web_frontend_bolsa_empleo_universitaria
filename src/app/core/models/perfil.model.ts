export interface Perfil {
  idPerfil?: number;
  carrera?: string;
  universidad?: string;
  semestre?: number;
  habilidades?: string;
  experiencia?: string;
  cvUrl?: string;
  disponibilidad?: 'INMEDIATA' | 'POR_DEFINIR';
  usuario?: any;
}
