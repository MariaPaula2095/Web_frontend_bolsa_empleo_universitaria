import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { EmpresaService } from '../../../core/services/empresa.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { PostulacionService } from '../../../core/services/postulacion.service';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';
import { Postulacion } from '../../../core/models/postulacion.model';

@Component({
  selector: 'app-empresa-postulantes',
  imports: [],
  templateUrl: './postulantes.component.html'
})
export class PostulantesComponent implements OnInit {
  ofertas: OfertaLaboral[] = [];
  postulantes: { [idOferta: number]: Postulacion[] } = {};
  expandido: number | null = null;
  cargando = true;
  actualizando: number | null = null;

  constructor(
    private auth: AuthService,
    private empresaService: EmpresaService,
    private ofertaService: OfertaLaboralService,
    private postulacionService: PostulacionService
  ) {}

  ngOnInit(): void {
    const email = this.auth.getSub();
    if (email) {
      this.empresaService.listar().subscribe(empresas => {
        const empresa = empresas.find(e => e.email === email);
        if (empresa?.idEmpresa) {
          this.ofertaService.listar().subscribe(ofertas => {
            this.ofertas = ofertas.filter((o: OfertaLaboral) => o.empresa?.idEmpresa === empresa.idEmpresa);
            this.cargando = false;
          });
        }
      });
    }
  }

  verPostulantes(idOferta: number): void {
    if (this.expandido === idOferta) { this.expandido = null; return; }
    this.expandido = idOferta;
    if (!this.postulantes[idOferta]) {
      this.postulacionService.porOferta(idOferta).subscribe(p => this.postulantes[idOferta] = p);
    }
  }

  cambiarEstado(postulacion: Postulacion, nuevoEstado: string): void {
    this.actualizando = postulacion.idPostulacion!;
    this.postulacionService.actualizar(postulacion.idPostulacion!, { estado: nuevoEstado as any }).subscribe({
      next: () => {
        postulacion.estado = nuevoEstado as any;
        this.actualizando = null;
      },
      error: () => { this.actualizando = null; }
    });
  }

  estadoClass(estado?: string): string {
    if (estado === 'ACEPTADA') return 'bg-green-100 text-green-800';
    if (estado === 'RECHAZADA') return 'bg-red-100 text-red-800';
    if (estado === 'EN_REVISION') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  }

  candidatoNombre(p: Postulacion): string {
    if (!p.usuario) return '—';
    if (typeof p.usuario === 'string') return p.usuario;
    return `${p.usuario.nombre ?? ''} ${p.usuario.apellido ?? ''}`.trim() || p.usuario.email || '—';
  }

  candidatoEmail(p: Postulacion): string {
    if (!p.usuario || typeof p.usuario === 'string') return '';
    return p.usuario.email ?? '';
  }
}
