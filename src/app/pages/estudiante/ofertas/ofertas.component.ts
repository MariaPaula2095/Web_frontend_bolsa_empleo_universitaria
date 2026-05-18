import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { PostulacionService } from '../../../core/services/postulacion.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-estudiante-ofertas',
  imports: [],
  templateUrl: './ofertas.component.html'
})
export class OfertasComponent implements OnInit {
  ofertas: OfertaLaboral[] = [];
  cargando = true;
  idUsuario: number | null = null;
  postulando: number | null = null;
  mensaje = '';

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private ofertaService: OfertaLaboralService,
    private postulacionService: PostulacionService,
    private perfilService: PerfilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resolverIdUsuario();
    this.ofertaService.activas().subscribe({
      next: d => { this.ofertas = d; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  private resolverIdUsuario(): void {
    const idStr = this.auth.getId();
    if (idStr) { this.idUsuario = Number(idStr); return; }
    const email = this.auth.getSub();
    this.perfilService.listar().subscribe({
      next: perfiles => {
        const porEmail = perfiles.find((p: any) => {
          const u = p.usuario;
          if (!u || typeof u !== 'object') return false;
          return u.email === email || u.correo === email || u.username === email;
        });
        const perfil = porEmail ?? (perfiles.length >= 1 ? perfiles[0] : null);
        if (perfil) {
          const u = perfil.usuario;
          const id = typeof u === 'number' ? u : (u?.idUsuario ?? u?.id ?? u?.userId);
          if (id) { this.idUsuario = Number(id); this.auth.storeId(Number(id)); }
        }
      },
      error: () => {}
    });
  }

  postular(idOferta: number): void {
  if (!this.idUsuario) { this.mensaje = 'Espera un momento e intenta de nuevo.'; return; }
  this.postulando = idOferta;
  this.postulacionService.guardar({
    idUsuario: this.idUsuario,
    idOferta: idOferta
  } as any).subscribe({
    next: () => {
      this.postulando = null;
      this.router.navigate(['/estudiante/postulaciones']);
    },
    error: () => { this.mensaje = 'Error al postularse. Puede que ya estés postulado.'; this.postulando = null; }
  });
}

  modalidadClass(m?: string): string {
    if (m === 'REMOTO') return 'bg-green-100 text-green-800';
    if (m === 'PRESENCIAL') return 'bg-blue-100 text-blue-800';
    if (m === 'HIBRIDO') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-700';
  }

  empresaNombre(o: OfertaLaboral): string {
    if (!o.empresa) return '';
    return typeof o.empresa === 'string' ? o.empresa : o.empresa.nombre ?? '';
  }

  formatSalario(s?: number): string {
    return s ? '$' + s.toLocaleString('es-CO') : 'A convenir';
  }
}
