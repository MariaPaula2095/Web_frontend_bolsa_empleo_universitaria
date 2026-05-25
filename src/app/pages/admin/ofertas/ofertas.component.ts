import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-admin-ofertas',
  imports: [FormsModule],
  templateUrl: './ofertas.component.html'
})
export class OfertasComponent implements OnInit {
  ofertasOriginales: OfertaLaboral[] = [];
  ofertasFiltradas: OfertaLaboral[] = [];
  cargando = true;

  busqueda = '';
  modalidadFiltro = '';
  estadoFiltro = '';

  constructor(private service: OfertaLaboralService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.service.listar().subscribe({
      next: d => {
        this.ofertasOriginales = d;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  aplicarFiltros(): void {
    const q = this.busqueda.toLowerCase().trim();
    this.ofertasFiltradas = this.ofertasOriginales.filter(o => {
      const coincideTexto = !q ||
        o.titulo?.toLowerCase().includes(q) ||
        this.empresaNombre(o).toLowerCase().includes(q);
      const coincideModalidad = !this.modalidadFiltro || o.modalidad === this.modalidadFiltro;
      const coincideEstado = !this.estadoFiltro ||
        (this.estadoFiltro === 'activa' ? o.estado === true : o.estado === false);
      return coincideTexto && coincideModalidad && coincideEstado;
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta oferta?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }

  get ofertas(): OfertaLaboral[] { return this.ofertasFiltradas; }

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
