import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="admin-home">
      <h2>Gestión administrativa</h2>
      <p>Administrá servicios, profesionales y usuarios desde un mismo panel.</p>
      <div class="cards">
        <a routerLink="/inicio/admin/servicios">Servicios</a>
        <a routerLink="/inicio/admin/profesionales">Profesionales</a>
        <a routerLink="/inicio/admin/usuarios">Usuarios</a>
      </div>
    </section>
  `,
  styles: [
    `.admin-home { display:flex; flex-direction:column; gap:1rem; }`,
    `.cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1rem; }`,
    `a { display:block; padding:1rem; border-radius:14px; background:#eff6ff; color:#1d4ed8; text-decoration:none; font-weight:700; }`,
  ],
})
export class AdminHomeComponent {}
