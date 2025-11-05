import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CocktailService } from '../../services/cocktail.service';
import { Cocktail, ApiResult } from '../../models/cocktail.model';

@Component({
  selector: 'app-cocktail-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cocktail-list.html',
  styleUrls: ['./cocktail-list.scss']
})
export class CocktailListComponent implements OnInit {
  cocktails: Cocktail[] = [];
  loading = false;
  query = '';
  errorMsg: string | null = null;

  constructor(private cocktailService: CocktailService) {}

  ngOnInit() {}

  search(): void {
    this.loading = true;
    this.errorMsg = null;

    this.cocktailService.searchByName(this.query).subscribe({
      next: (result: ApiResult<Cocktail[]>) => {
        if (result.success && result.data) {
          this.cocktails = result.data;
        } else {
          this.cocktails = [];
          this.errorMsg = result.error || 'No se encontraron resultados.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en la suscripción:', err);
        this.cocktails = [];
        this.errorMsg = 'Error al consultar la API';
        this.loading = false;
      }
    });
  }
}
