import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../components/menu/menu.component';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MenuComponent, NavbarComponent],
  template: `
    <div class="app-layout">
      <app-menu class="menu-grid-item"></app-menu>
      <app-navbar class="navbar-grid-item"></app-navbar>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    @import '../app.css';
  `],
})
export class MainLayoutComponent {}
