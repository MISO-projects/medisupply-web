import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlertasService } from '../../../services/alertas.service';
import { EmailData, EmailDestinatario, Severidad } from '../../../models/alerta.model';

@Component({
  selector: 'app-alerta-emails',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './alerta-emails.component.html',
  styleUrls: ['./alerta-emails.component.css'],
})
export class AlertaEmailsComponent implements OnInit {
  private alertasService = inject(AlertasService);

  emails = signal<EmailDestinatario[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  activosSolo = signal<boolean>(true);

  form = signal<EmailData>({
    email: '',
    nombre: '',
    cargo: '',
    severidades_minimas: ['ALTA', 'CRITICA'],
  });

  readonly severidadOpts: Severidad[] = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];

  ngOnInit(): void {
    this.loadEmails();
  }

  loadEmails(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.alertasService.listarEmails(this.activosSolo()).subscribe({
      next: (list) => {
        this.emails.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar emails');
        this.isLoading.set(false);
      },
    });
  }

  addEmail(): void {
    const payload = this.form();
    if (!payload.email) return;
    this.isLoading.set(true);
    this.alertasService.registrarEmail(payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadEmails();
      },
      error: (err) => {
        console.error(err);
        this.error.set(
          err?.status === 409 ? 'Este email ya está registrado' : 'No se pudo registrar el email',
        );
        this.isLoading.set(false);
      },
    });
  }

  deleteEmail(id: string): void {
    this.isLoading.set(true);
    this.alertasService.eliminarEmail(id).subscribe({
      next: () => this.loadEmails(),
      error: (err) => {
        console.error(err);
        this.error.set('No se pudo eliminar el email');
        this.isLoading.set(false);
      },
    });
  }

  private resetForm(): void {
    this.form.set({
      email: '',
      nombre: '',
      cargo: '',
      severidades_minimas: ['ALTA', 'CRITICA'],
    });
  }
}
