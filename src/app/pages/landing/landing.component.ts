import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OfertaLaboralService } from '../../core/services/oferta-laboral.service';
import { OfertaLaboral } from '../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit {
  ofertas: OfertaLaboral[] = [];
  cargando = true;

  constructor(private ofertaService: OfertaLaboralService) {}

  ngOnInit(): void {
    this.ofertaService.activas().subscribe({
      next: (data) => { this.ofertas = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  modalidadClass(modalidad?: string): string {
    if (modalidad === 'REMOTO') return 'bg-green-100 text-green-800';
    if (modalidad === 'PRESENCIAL') return 'bg-blue-100 text-blue-800';
    if (modalidad === 'HIBRIDO') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  }

  formatSalario(s?: number): string {
    return s ? '$' + s.toLocaleString('es-CO') : 'A convenir';
  }

  empresaNombre(oferta: OfertaLaboral): string {
    if (!oferta.empresa) return '';
    return typeof oferta.empresa === 'string' ? oferta.empresa : oferta.empresa.nombre ?? '';
  }
}
