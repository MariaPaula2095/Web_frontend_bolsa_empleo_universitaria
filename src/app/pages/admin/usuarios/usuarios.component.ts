import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-admin-usuarios',
  imports: [],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = true;
  error = '';

  constructor(private service: UsuarioService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.service.listar().subscribe({
      next: d => { this.usuarios = d; this.cargando = false; },
      error: (e: any) => { this.error = `Error ${e.status}: ${e.message}`; this.cargando = false; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;
    this.service.eliminar(id).subscribe({ next: () => this.cargar() });
  }

  rolClass(rol?: string): string {
    if (rol === 'ADMIN') return 'bg-red-100 text-red-800';
    if (rol === 'EMPRESA') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  }
}
