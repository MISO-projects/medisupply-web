import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, MatButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = signal<string>('Usuario');

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user.username) {
          this.username.set(user.username);
        }
      },
      error: (err) => {
        console.error('Error al obtener información del usuario:', err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
