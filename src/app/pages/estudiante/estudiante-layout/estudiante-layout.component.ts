import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ArchivoService } from '../../../core/services/archivo.service';

@Component({
  selector: 'app-estudiante-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './estudiante-layout.component.html'
})
export class EstudianteLayoutComponent implements OnInit {
  fotoUrl: string | null = null;

  constructor(private auth: AuthService, private archivoService: ArchivoService) {}

  ngOnInit(): void {
    const id = this.auth.getId();
    if (id) {
      this.archivoService.getFotoUsuario(Number(id)).subscribe({
        next: blob => { if (blob.size > 0) this.fotoUrl = URL.createObjectURL(blob); },
        error: () => {}
      });
    }
  }

  get iniciales(): string {
    return (this.auth.getSub() ?? 'U').charAt(0).toUpperCase();
  }

  logout(): void { this.auth.logout(); }
}
