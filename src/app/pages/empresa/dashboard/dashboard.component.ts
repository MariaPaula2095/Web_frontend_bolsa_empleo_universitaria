import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EmpresaService } from '../../../core/services/empresa.service';
import { OfertaLaboralService } from '../../../core/services/oferta-laboral.service';
import { PostulacionService } from '../../../core/services/postulacion.service';
import { Empresa } from '../../../core/models/empresa.model';
import { OfertaLaboral } from '../../../core/models/oferta-laboral.model';

@Component({
  selector: 'app-empresa-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  empresa: Empresa | null = null;
  ofertasCount = 0;
  postulantesCount = 0;
  ofertasActivas = 0;

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
        this.empresa = empresas.find(e => e.email?.toLowerCase() === email?.toLowerCase()) ?? null;
        if (this.empresa?.idEmpresa) {
          const myId = Number(this.empresa.idEmpresa);
          this.ofertaService.listar().subscribe(ofertas => {
            const mias = ofertas.filter(o => {
              const oid = Number(o.idEmpresa) || Number((o.empresa as any)?.idEmpresa);
              return oid === myId;
            });
            this.ofertasCount = mias.length;
            this.ofertasActivas = mias.filter(o => o.estado).length;
            mias.forEach(o => {
              this.postulacionService.porOferta(o.idOferta!).subscribe(p => {
                this.postulantesCount += p.length;
              });
            });
          });
        }
      });
    }
  }
}
