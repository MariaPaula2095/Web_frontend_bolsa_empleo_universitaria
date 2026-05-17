import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-estudiante-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './estudiante-layout.component.html'
})
export class EstudianteLayoutComponent {
  constructor(private auth: AuthService) {}
  logout(): void { this.auth.logout(); }
}
