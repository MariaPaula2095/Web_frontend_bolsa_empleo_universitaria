import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { EmpresaService } from '../../../core/services/empresa.service';
import { EmpresaPendienteService } from '../../../core/services/empresa-pendiente.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats = { usuarios: 0, empresas: 0, pendientes: 0, ofertas: 0 };

  constructor(
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private pendienteService: EmpresaPendienteService,
    private ofertaService: OfertaLaboralService
  ) {}

  ngOnInit(): void {
    this.usuarioService.listar().subscribe({ next: d => this.stats.usuarios = d.length, error: () => {} });
    this.empresaService.listar().subscribe({ next: d => this.stats.empresas = d.length, error: () => {} });
    this.pendienteService.listar().subscribe({ next: d => this.stats.pendientes = d.filter(e => e.estado === 'PENDIENTE').length, error: () => {} });
    this.ofertaService.listar().subscribe({ next: d => this.stats.ofertas = d.length, error: () => {} });
  }
}
