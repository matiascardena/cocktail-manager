import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { CocktailService } from '../../services/cocktail.service';
import { FavoriteService } from '../../services/favorite.service';
import { Cocktail, ApiResult } from '../../models/cocktail.model';
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
    MatBadgeModule
  ],
  templateUrl: './cocktail-list.html',
  styleUrls: ['./cocktail-list.scss'],
})
export class CocktailListComponent implements OnInit {
  cocktails: Cocktail[] = [];
  loading = false;
  query = '';
  errorMsg: string | null = null;
  showFavorites = false;
  favoritesCount = 0;

  constructor(
    private cocktailService: CocktailService,
    private favoriteService: FavoriteService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.favoriteService.getFavoritesCount$().subscribe(count => {
      this.favoritesCount = count;
    });
  }

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

  isFavorite(idDrink: string): boolean {
    return this.favoriteService.isFavorite(idDrink);
  }

  toggleFavorite(idDrink: string): void {
    const cocktail = this.cocktails.find(c => c.idDrink === idDrink);
    if (!cocktail) return;

    const nowFav = this.favoriteService.toggleFavorite(cocktail);

    if (this.showFavorites && !nowFav) {
      this.cocktails = this.cocktails.filter(c => c.idDrink !== idDrink);
      if (this.cocktails.length === 0) {
        this.errorMsg = 'No tienes cócteles favoritos aún.';
      }
    }

    console.log(`${cocktail.strDrink} ${nowFav ? 'añadido a' : 'removido de'} favoritos`);
  }

  openDetails(cocktail: Cocktail): void {
    this.dialog.open(CocktailDetailComponent, {
      width: '500px',
      data: { cocktail },
    });
  }

  toggleView(): void {
    this.showFavorites = !this.showFavorites;
    this.errorMsg = null;

    if (this.showFavorites) {
      this.loadFavorites();
    } else {
      this.cocktails = [];
    }
  }

  private loadFavorites(): void {
    const favs = this.favoriteService.getFavorites(); // debe devolver Cocktail[]
    if (favs && favs.length > 0) {
      this.cocktails = favs;
    } else {
      this.cocktails = [];
      this.errorMsg = 'No tienes cócteles favoritos aún.';
    }
  }
}
