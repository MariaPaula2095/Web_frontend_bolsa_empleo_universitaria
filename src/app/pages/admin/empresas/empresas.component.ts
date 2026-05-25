import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../core/services/empresa.service';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-admin-empresas',
  imports: [FormsModule],
  templateUrl: './empresas.component.html'
})
export class EmpresasComponent implements OnInit {
  empresasOriginales: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  cargando = true;

  busqueda = '';

  constructor(private service: EmpresaService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.service.listar().subscribe({
      next: d => {
        this.empresasOriginales = d;
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
      e.email?.toLowerCase().includes(q) ||
      e.ciudad?.toLowerCase().includes(q)
    );
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta empresa?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }

  get empresas(): Empresa[] { return this.empresasFiltradas; }
}
