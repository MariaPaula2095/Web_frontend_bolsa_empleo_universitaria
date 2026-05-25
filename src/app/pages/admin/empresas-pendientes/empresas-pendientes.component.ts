import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaPendienteService } from '../../../core/services/empresa-pendiente.service';
import { EmpresaPendiente } from '../../../core/models/empresa-pendiente.model';

@Component({
  selector: 'app-empresas-pendientes',
  imports: [FormsModule],
  templateUrl: './empresas-pendientes.component.html'
})
export class EmpresasPendientesComponent implements OnInit {
  empresasOriginales: EmpresaPendiente[] = [];
  empresasFiltradas: EmpresaPendiente[] = [];
  cargando = true;
  mensajes: { [id: number]: string } = {};

  busqueda = '';

  constructor(private service: EmpresaPendienteService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.service.listar().subscribe({
      next: d => {
        this.empresasOriginales = d.filter(e => e.estado === 'PENDIENTE');
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  aplicarFiltros(): void {
    const q = this.busqueda.toLowerCase().trim();
    this.empresasFiltradas = this.empresasOriginales.filter(e =>
      !q ||
      e.nombre?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q)
    );
  }

  get empresas(): EmpresaPendiente[] { return this.empresasFiltradas; }

  aprobar(id: number): void {
    this.service.aprobar(id, this.mensajes[id]).subscribe({ next: () => this.cargar() });
  }

  rechazar(id: number): void {
    if (!this.mensajes[id]?.trim()) { alert('Escribe un motivo de rechazo'); return; }
    this.service.rechazar(id, this.mensajes[id]).subscribe({ next: () => this.cargar() });
  }

  estadoClass(estado?: string): string {
    if (estado === 'APROBADA') return 'bg-green-100 text-green-800';
    if (estado === 'RECHAZADA') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  }
}
