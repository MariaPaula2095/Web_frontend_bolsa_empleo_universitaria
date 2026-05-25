import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-admin-usuarios',
  imports: [FormsModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  usuariosOriginales: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargando = true;
  error = '';

  busqueda = '';
  estadoFiltro = '';

  constructor(private service: UsuarioService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.service.listar().subscribe({
      next: d => {
        this.usuariosOriginales = d;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (e: any) => { this.error = `Error ${e.status}: ${e.message}`; this.cargando = false; }
    });
  }

  aplicarFiltros(): void {
    const q = this.busqueda.toLowerCase().trim();
    this.usuariosFiltrados = this.usuariosOriginales.filter(u => {
      const coincideTexto = !q ||
        `${u.nombre ?? ''} ${u.apellido ?? ''}`.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const coincideEstado = !this.estadoFiltro ||
        (this.estadoFiltro === 'activo' ? u.estado === true : u.estado === false);
      return coincideTexto && coincideEstado;
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }

  get usuarios(): Usuario[] { return this.usuariosFiltrados; }

  rolClass(rol?: string): string {
    if (rol === 'ADMIN') return 'bg-red-100 text-red-800';
    if (rol === 'EMPRESA') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  }
}
