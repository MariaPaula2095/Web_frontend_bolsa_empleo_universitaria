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
  empresas: EmpresaPendiente[] = [];
  cargando = true;
  mensajes: { [id: number]: string } = {};

  constructor(private service: EmpresaPendienteService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.service.listar().subscribe({
      next: d => { this.empresas = d.filter(e => e.estado === 'PENDIENTE'); this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

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
