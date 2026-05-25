import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { PostulacionService } from '../../../core/services/postulacion.service';
import { SeguimientoService } from '../../../core/services/seguimiento.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { Postulacion } from '../../../core/models/postulacion.model';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';
import { SeguimientoPostulacion } from '../../../core/models/seguimiento.model';

@Component({
  selector: 'app-estudiante-postulaciones',
  imports: [],
  templateUrl: './postulaciones.component.html'
})
export class PostulacionesComponent implements OnInit {
  postulaciones: Postulacion[] = [];
  ofertas: { [id: number]: OfertaLaboral } = {};
  cargando = true;
  historial: { [id: number]: SeguimientoPostulacion[] } = {};
  expandido: number | null = null;

  constructor(
    private auth: AuthService,
    private postulacionService: PostulacionService,
    private seguimientoService: SeguimientoService,
    private ofertaService: OfertaLaboralService
  ) {}

  ngOnInit(): void {
    const idStr = this.auth.getId();
    if (idStr) {
      this.cargar(Number(idStr));
    } else {
      this.cargando = false;
    }
  }

  private cargar(idUsuario: number): void {
    // Cargar ofertas y postulaciones en paralelo
    this.ofertaService.listar().subscribe({
      next: ofertas => {
        ofertas.forEach(o => {
          if (o.idOferta) this.ofertas[o.idOferta] = o;
        });
      },
      error: () => {}
    });

    this.postulacionService.porCandidato(idUsuario).subscribe({
      next: d => { this.postulaciones = d; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  cancelar(p: Postulacion): void {
    if (!confirm('¿Cancelar esta postulación?')) return;
    this.postulacionService.eliminar(p.idPostulacion!).subscribe({
      next: () => {
        this.postulaciones = this.postulaciones.filter(x => x.idPostulacion !== p.idPostulacion);
      },
      error: () => alert('No se pudo cancelar la postulación. Intenta de nuevo.')
    });
  }

  verHistorial(idPostulacion: number): void {
    if (this.expandido === idPostulacion) { this.expandido = null; return; }
    this.expandido = idPostulacion;
    if (!this.historial[idPostulacion]) {
      this.seguimientoService.historial(idPostulacion).subscribe(h => this.historial[idPostulacion] = h);
    }
  }

  empresaNombre(p: any): string {
    if (p.ofertaLaboral && typeof p.ofertaLaboral === 'object') {
      const emp = p.ofertaLaboral.empresa;
      if (emp && typeof emp === 'object') return emp.nombre ?? '';
      if (typeof emp === 'string') return emp;
    }
    const idOferta = p.ofertaLaboral?.idOferta ?? p.idOferta;
    if (idOferta && this.ofertas[idOferta]) {
      const emp = this.ofertas[idOferta].empresa;
      if (emp && typeof emp === 'object') return emp.nombre ?? '';
      if (typeof emp === 'string') return emp;
    }
    return '';
  }

  ofertaTitulo(p: any): string {
    // Intentar con objeto completo primero
    if (p.ofertaLaboral && typeof p.ofertaLaboral === 'object') {
      return p.ofertaLaboral.titulo ?? '—';
    }
    // Luego con idOferta cruzando con el mapa de ofertas
    if (p.idOferta && this.ofertas[p.idOferta]) {
      return this.ofertas[p.idOferta].titulo ?? '—';
    }
    return '—';
  }

  estadoClass(estado?: string): string {
    if (estado === 'ACEPTADA') return 'bg-green-100 text-green-800';
    if (estado === 'RECHAZADA') return 'bg-red-100 text-red-800';
    if (estado === 'EN_REVISION') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  }
}