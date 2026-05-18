import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { PostulacionService } from '../../../core/services/postulacion.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';
import { Postulacion } from '../../../core/models/postulacion.model';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-empresa-postulantes',
  imports: [],
  templateUrl: './postulantes.component.html'
})
export class PostulantesComponent implements OnInit {
  ofertas: OfertaLaboral[] = [];
  postulantes: { [idOferta: number]: Postulacion[] } = {};
  usuarios: { [idUsuario: number]: Usuario } = {};
  expandido: number | null = null;
  cargando = true;
  actualizando: number | null = null;

  constructor(
    private auth: AuthService,
    private ofertaService: OfertaLaboralService,
    private postulacionService: PostulacionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const idEmpresa = Number(this.auth.getId());

    // Cargar usuarios para cruzar con postulaciones
    this.usuarioService.listar().subscribe({
      next: usuarios => {
        usuarios.forEach(u => {
          if (u.idUsuario) this.usuarios[u.idUsuario] = u;
        });
      },
      error: () => {}
    });

    // Cargar ofertas de esta empresa
    this.ofertaService.listar().subscribe({
      next: ofertas => {
        this.ofertas = ofertas.filter(o => Number((o as any).idEmpresa) === idEmpresa);
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  verPostulantes(idOferta: number): void {
    if (this.expandido === idOferta) { this.expandido = null; return; }
    this.expandido = idOferta;
    if (!this.postulantes[idOferta]) {
      this.postulacionService.porOferta(idOferta).subscribe({
        next: p => this.postulantes[idOferta] = p,
        error: () => this.postulantes[idOferta] = []
      });
    }
  }

  cambiarEstado(postulacion: Postulacion, nuevoEstado: string): void {
    this.actualizando = postulacion.idPostulacion!;
    this.postulacionService.actualizar(postulacion.idPostulacion!, { estado: nuevoEstado as any }).subscribe({
      next: () => {
        postulacion.estado = nuevoEstado as any;
        this.actualizando = null;
      },
      error: () => { this.actualizando = null; }
    });
  }

  estadoClass(estado?: string): string {
    if (estado === 'ACEPTADA') return 'bg-green-100 text-green-800';
    if (estado === 'RECHAZADA') return 'bg-red-100 text-red-800';
    if (estado === 'EN_REVISION') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  candidatoNombre(p: any): string {
    // Intentar con objeto usuario anidado
    if (p.usuario && typeof p.usuario === 'object') {
      return `${p.usuario.nombre ?? ''} ${p.usuario.apellido ?? ''}`.trim() || p.usuario.email || '—';
    }
    // Cruzar con mapa de usuarios por idUsuario
    const u = this.usuarios[p.idUsuario];
    if (u) return `${u.nombre ?? ''} ${u.apellido ?? ''}`.trim() || u.email || '—';
    return '—';
  }

  candidatoEmail(p: any): string {
    if (p.usuario && typeof p.usuario === 'object') return p.usuario.email ?? '';
    const u = this.usuarios[p.idUsuario];
    return u?.email ?? '';
  }
}