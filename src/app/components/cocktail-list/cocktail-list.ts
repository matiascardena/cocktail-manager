import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CocktailService } from '../../services/cocktail.service';
import { Cocktail, ApiResult } from '../../models/cocktail.model';
import { MatDialog } from '@angular/material/dialog';
import { CocktailDetailComponent } from '../cocktail-detail/cocktail-detail';

@Component({
  selector: 'app-cocktail-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './cocktail-list.html',
  styleUrls: ['./cocktail-list.scss'],
})
export class CocktailListComponent implements OnInit {
  cocktails: Cocktail[] = [];
  loading = false;
  query = '';
  errorMsg: string | null = null;
  favorites = new Set<string>();

 constructor(private cocktailService: CocktailService, private dialog: MatDialog) {}

  ngOnInit() {}

  search(): void {
    this.loading = true;
    this.errorMsg = null;
    this.cocktails = [];

    this.cocktailService.searchByName(this.query).subscribe({
      next: (result: ApiResult<Cocktail[]>) => {
        const drinks = result.data;
        if (result.success && Array.isArray(drinks) && drinks.length > 0) {
          this.cocktails = drinks;
        } else {
          this.errorMsg = 'No se encontraron resultados.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en la suscripción:', err);
        this.errorMsg = 'Error al consultar la API';
        this.loading = false;
      },
    });
  }

  toggleFavorite(idDrink: string): void {
    if (this.favorites.has(idDrink)) {
      this.favorites.delete(idDrink);
    } else {
      this.favorites.add(idDrink);
    }
  }

  isFavorite(idDrink: string): boolean {
    return this.favorites.has(idDrink);
  }

  openDetails(cocktail: Cocktail): void {
    this.dialog.open(CocktailDetailComponent, {
      width: '500px',
      data: { cocktail },
    });
  }
}
