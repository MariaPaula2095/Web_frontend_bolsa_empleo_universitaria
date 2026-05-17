import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { PostulacionService } from '../../../core/services/postulacion.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { SeguimientoService } from '../../../core/services/seguimiento.service';
import { Postulacion } from '../../../core/models/postulacion.model';
import { SeguimientoPostulacion } from '../../../core/models/seguimiento.model';

@Component({
  selector: 'app-estudiante-postulaciones',
  imports: [],
  templateUrl: './postulaciones.component.html'
})
export class PostulacionesComponent implements OnInit {
  postulaciones: Postulacion[] = [];
  cargando = true;
  historial: { [id: number]: SeguimientoPostulacion[] } = {};
  expandido: number | null = null;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private postulacionService: PostulacionService,
    private perfilService: PerfilService,
    private seguimientoService: SeguimientoService
  ) {}

  ngOnInit(): void {
    const idStr = this.auth.getId();
    if (idStr) { this.cargar(Number(idStr)); return; }
    this.perfilService.listar().subscribe({
      next: perfiles => {
        const id = this.extraerIdDePerfiles(perfiles);
        if (id) { this.auth.storeId(id); this.cargar(id); }
        else { this.cargando = false; }
      },
      error: () => { this.cargando = false; }
    });
  }

  private extraerIdDePerfiles(perfiles: any[]): number | null {
    const email = this.auth.getSub();
    const porEmail = perfiles.find((p: any) => {
      const u = p.usuario;
      if (!u || typeof u !== 'object') return false;
      return u.email === email || u.correo === email || u.username === email;
    });
    const perfil = porEmail ?? (perfiles.length >= 1 ? perfiles[0] : null);
    if (!perfil) return null;
    const u = perfil.usuario;
    if (typeof u === 'number' && u > 0) return u;
    if (typeof u === 'object' && u) {
      const id = u.idUsuario ?? u.id ?? u.userId;
      if (id) return Number(id);
    }
    return null;
  }

  private cargar(idUsuario: number): void {
    this.postulacionService.porCandidato(idUsuario).subscribe({
      next: d => { this.postulaciones = d; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  verHistorial(idPostulacion: number): void {
    if (this.expandido === idPostulacion) { this.expandido = null; return; }
    this.expandido = idPostulacion;
    if (!this.historial[idPostulacion]) {
      this.seguimientoService.historial(idPostulacion).subscribe(h => this.historial[idPostulacion] = h);
    }
  }

  estadoClass(estado?: string): string {
    if (estado === 'ACEPTADA') return 'bg-green-100 text-green-800';
    if (estado === 'RECHAZADA') return 'bg-red-100 text-red-800';
    if (estado === 'EN_REVISION') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  ofertaTitulo(p: Postulacion): string {
    if (!p.ofertaLaboral) return '—';
    return typeof p.ofertaLaboral === 'string' ? p.ofertaLaboral : p.ofertaLaboral.titulo ?? '—';
  }
}
