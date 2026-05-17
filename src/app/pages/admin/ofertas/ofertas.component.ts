import { Component, OnInit } from '@angular/core';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-admin-ofertas',
  imports: [],
  templateUrl: './ofertas.component.html'
})
export class OfertasComponent implements OnInit {
  ofertas: OfertaLaboral[] = [];
  cargando = true;

  constructor(private service: OfertaLaboralService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.service.listar().subscribe({
      next: d => { this.ofertas = d; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta oferta?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }

  modalidadClass(m?: string): string {
    if (m === 'REMOTO') return 'bg-green-100 text-green-800';
    if (m === 'PRESENCIAL') return 'bg-blue-100 text-blue-800';
    if (m === 'HIBRIDO') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-700';
  }

  empresaNombre(o: OfertaLaboral): string {
    if (!o.empresa) return '—';
    return typeof o.empresa === 'string' ? o.empresa : o.empresa.nombre ?? '—';
  }
}
