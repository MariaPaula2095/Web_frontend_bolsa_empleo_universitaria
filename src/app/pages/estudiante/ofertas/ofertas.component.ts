import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { PostulacionService } from '../../../core/services/postulacion.service';
import { PerfilService } from '../../../core/services/perfil.service';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-estudiante-ofertas',
  imports: [FormsModule],
  templateUrl: './ofertas.component.html'
})
export class OfertasComponent implements OnInit {
  ofertasOriginales: OfertaLaboral[] = [];
  ofertasFiltradas: OfertaLaboral[] = [];
  cargando = true;
  idUsuario: number | null = null;
  postulando: number | null = null;
  yaPostulado = new Set<number>();
  mensaje = '';

  busqueda = '';
  modalidadFiltro = '';
  orden = 'recientes';

  constructor(
    private auth: AuthService,
    private usuarioService: UsuarioService,
    private ofertaService: OfertaLaboralService,
    private postulacionService: PostulacionService,
    private perfilService: PerfilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resolverIdUsuario();
    this.ofertaService.activas().subscribe({
      next: d => { this.ofertasOriginales = d; this.aplicarFiltros(); this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  private cargarYaPostulado(idUsuario: number): void {
    this.postulacionService.porCandidato(idUsuario).subscribe({
      next: postulaciones => {
        postulaciones.forEach(p => {
          const idOferta = (p.ofertaLaboral as any)?.idOferta ?? (p as any).idOferta;
          if (idOferta) this.yaPostulado.add(Number(idOferta));
        });
      },
      error: () => {}
    });
  }

  private resolverIdUsuario(): void {
    const idStr = this.auth.getId();
    if (idStr) { this.idUsuario = Number(idStr); this.cargarYaPostulado(Number(idStr)); return; }
    const email = this.auth.getSub();
    this.perfilService.listar().subscribe({
      next: perfiles => {
        const porEmail = perfiles.find((p: any) => {
          const u = p.usuario;
          if (!u || typeof u !== 'object') return false;
          return u.email === email || u.correo === email || u.username === email;
        });
        const perfil = porEmail ?? (perfiles.length >= 1 ? perfiles[0] : null);
        if (perfil) {
          const u = perfil.usuario;
          const id = typeof u === 'number' ? u : (u?.idUsuario ?? u?.id ?? u?.userId);
          if (id) { this.idUsuario = Number(id); this.auth.storeId(Number(id)); this.cargarYaPostulado(Number(id)); }
        }
      },
      error: () => {}
    });
  }

  aplicarFiltros(): void {
    const q = this.busqueda.toLowerCase().trim();
    let resultado = this.ofertasOriginales.filter(o => {
      const coincideTexto = !q ||
        o.titulo?.toLowerCase().includes(q) ||
        o.area?.toLowerCase().includes(q) ||
        this.empresaNombre(o).toLowerCase().includes(q);
      const coincideModalidad = !this.modalidadFiltro || o.modalidad === this.modalidadFiltro;
      return coincideTexto && coincideModalidad;
    });

    if (this.orden === 'salario-desc') {
      resultado = [...resultado].sort((a, b) => (b.salario ?? 0) - (a.salario ?? 0));
    } else if (this.orden === 'salario-asc') {
      resultado = [...resultado].sort((a, b) => (a.salario ?? 0) - (b.salario ?? 0));
    } else {
      resultado = [...resultado].sort((a, b) =>
        (b.fechaPublicacion ?? '').localeCompare(a.fechaPublicacion ?? '')
      );
    }
    this.ofertasFiltradas = resultado;
  }

  setBusqueda(val: string): void { this.busqueda = val; this.aplicarFiltros(); }
  setModalidad(val: string): void { this.modalidadFiltro = val; this.aplicarFiltros(); }
  setOrden(val: string): void { this.orden = val; this.aplicarFiltros(); }

  postular(idOferta: number): void {
  if (!this.idUsuario) { this.mensaje = 'Espera un momento e intenta de nuevo.'; return; }
  this.postulando = idOferta;
  this.postulacionService.guardar({
    idUsuario: this.idUsuario,
    idOferta: idOferta
  } as any).subscribe({
    next: () => {
      this.postulando = null;
      this.router.navigate(['/estudiante/postulaciones']);
    },
    error: () => { this.mensaje = 'Error al postularse. Puede que ya estés postulado.'; this.postulando = null; }
  });
}

  modalidadClass(m?: string): string {
    if (m === 'REMOTO') return 'bg-green-100 text-green-800';
    if (m === 'PRESENCIAL') return 'bg-blue-100 text-blue-800';
    if (m === 'HIBRIDO') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-700';
  }

  empresaNombre(o: OfertaLaboral): string {
    if (!o.empresa) return '';
    return typeof o.empresa === 'string' ? o.empresa : o.empresa.nombre ?? '';
  }

  formatSalario(s?: number): string {
    return s ? '$' + s.toLocaleString('es-CO') : 'A convenir';
  }
}
