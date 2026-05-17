import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { PostulacionService } from '../../../core/services/postulacion.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { Postulacion } from '../../../core/models/postulacion.model';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-estudiante-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  nombre = '';
  postulaciones: Postulacion[] = [];
  ofertas: OfertaLaboral[] = [];
  idUsuario: number | null = null;
  aceptadas = 0;

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private postulacionService: PostulacionService,
    private ofertaService: OfertaLaboralService
  ) {}

  ngOnInit(): void {
    const idStr = this.auth.getId();
    const email = this.auth.getSub();
    if (idStr) {
      this.idUsuario = Number(idStr);
      this.nombre = email?.split('@')[0] ?? '';
      this.postulacionService.porCandidato(this.idUsuario).subscribe({
        next: p => { this.postulaciones = p; this.aceptadas = p.filter(x => x.estado === 'ACEPTADA').length; },
        error: () => {}
      });
    } else if (email) {
      this.usuarioService.buscarPorEmail(email).subscribe({
        next: u => {
          this.nombre = u.nombre;
          this.idUsuario = u.idUsuario!;
          this.postulacionService.porCandidato(u.idUsuario!).subscribe({
            next: p => { this.postulaciones = p; this.aceptadas = p.filter(x => x.estado === 'ACEPTADA').length; },
            error: () => {}
          });
        },
        error: () => {}
      });
    }
    this.ofertaService.activas().subscribe({ next: o => this.ofertas = o.slice(0, 3), error: () => {} });
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
