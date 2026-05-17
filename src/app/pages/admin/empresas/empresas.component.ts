import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../../core/services/empresa.service';
import { Empresa } from '../../../core/models/empresa.model';

@Component({
  selector: 'app-admin-empresas',
  imports: [],
  templateUrl: './empresas.component.html'
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  cargando = true;

  constructor(private service: EmpresaService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.service.listar().subscribe({
      next: d => { this.empresas = d; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta empresa?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }
}
