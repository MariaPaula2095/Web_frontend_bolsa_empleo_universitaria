import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-empresa-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './empresa-layout.component.html'
})
export class EmpresaLayoutComponent {
  constructor(private auth: AuthService) {}
  logout(): void { this.auth.logout(); }
}
