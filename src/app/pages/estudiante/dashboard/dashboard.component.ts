import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
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
  ofertasMap: { [id: number]: OfertaLaboral } = {};
  ofertas: OfertaLaboral[] = [];
  idUsuario: number | null = null;
  aceptadas = 0;

  constructor(
    private auth: AuthService,
    private postulacionService: PostulacionService,
    private ofertaService: OfertaLaboralService
  ) {}

  ngOnInit(): void {
    const email = this.auth.getSub();
    this.nombre = email?.split('@')[0] ?? '';

    const idStr = this.auth.getId();
    if (idStr) {
      this.idUsuario = Number(idStr);
      this.cargarPostulaciones(this.idUsuario);
    }

    // Cargar ofertas para el mapa de títulos y las recientes
    this.ofertaService.listar().subscribe({
      next: o => {
        o.forEach(oferta => {
          if (oferta.idOferta) this.ofertasMap[oferta.idOferta] = oferta;
        });
        this.ofertas = o.slice(0, 3);
      },
      error: () => {}
    });
  }

  private cargarPostulaciones(idUsuario: number): void {
    this.postulacionService.porCandidato(idUsuario).subscribe({
      next: p => {
        this.postulaciones = p;
        this.aceptadas = p.filter(x => x.estado === 'ACEPTADA').length;
      },
      error: () => {}
    });
  }

  estadoClass(estado?: string): string {
    if (estado === 'ACEPTADA') return 'bg-green-100 text-green-800';
    if (estado === 'RECHAZADA') return 'bg-red-100 text-red-800';
    if (estado === 'EN_REVISION') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  ofertaTitulo(p: any): string {
    // Intentar con objeto completo
    if (p.ofertaLaboral && typeof p.ofertaLaboral === 'object') {
      return p.ofertaLaboral.titulo ?? '—';
    }
    // Cruzar con mapa por idOferta
    if (p.idOferta && this.ofertasMap[p.idOferta]) {
      return this.ofertasMap[p.idOferta].titulo ?? '—';
    }
    return '—';
  }
}