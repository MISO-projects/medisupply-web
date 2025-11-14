import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AlertasService } from '../../../services/alertas.service';
import { Alerta, RevisarAlertaData } from '../../../models/alerta.model';

@Component({
  selector: 'app-alerta-detail',
  imports: [CommonModule, FormsModule, MatButtonModule, MatSelectModule, MatInputModule],
  templateUrl: './alerta-detail.component.html',
  styleUrls: ['./alerta-detail.component.css'],
})
export class AlertaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alertasService = inject(AlertasService);

  alerta = signal<Alerta | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  form = signal<RevisarAlertaData>({ estado: 'REVISADO', notas_revision: '' });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAlerta(id);
    }
  }

  private loadAlerta(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.alertasService.getAlerta(id).subscribe({
      next: (a) => {
        this.alerta.set(a);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Alerta no encontrada');
        this.isLoading.set(false);
      },
    });
  }

  guardarRevision(): void {
    const a = this.alerta();
    if (!a) return;
    this.isLoading.set(true);
    this.alertasService.revisarAlerta(a.id, this.form()).subscribe({
      next: (res) => {
        this.alerta.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudo actualizar la alerta');
        this.isLoading.set(false);
      },
    });
  }
}


