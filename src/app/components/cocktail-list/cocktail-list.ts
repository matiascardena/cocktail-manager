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
import { CocktailService } from '../../services/cocktail.service';
import { Cocktail, ApiResult } from '../../models/cocktail.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CocktailDetailComponent } from '../cocktail-detail/cocktail-detail';
import { FavoriteService } from '../../services/favorite.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

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
    MatBadgeModule,
    MatDialogModule,
    MatOptionModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './cocktail-list.html',
  styleUrls: ['./cocktail-list.scss']
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
    private dialog: MatDialog,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
  // Suscripción al conteo
  this.favoriteService.getFavoritesCount$().subscribe(count => {
    this.favoritesCount = count;
  });

  // Suscripción a cambios en la lista de favoritos
  this.favoriteService.getFavorites$().subscribe(favs => {
    if (this.showFavorites) {
      this.cocktails = favs.length > 0 ? favs : [];
      this.errorMsg = favs.length === 0 ? 'No tienes cócteles favoritos aún.' : null;
    }
  });
}

search(): void {
  this.errorMsg = null;

  if (!this.query || this.query.trim() === '') {
    this.errorMsg = 'Debes ingresar un valor de búsqueda.';
    return;
  }

  const trimmedQuery = this.query.trim();

  switch (this.searchType) {
    case 'name':
      if (trimmedQuery.length > 50) {
        this.errorMsg = 'El nombre no puede superar los 50 caracteres.';
        return;
      }
      break;

    case 'id':
      if (!/^\d+$/.test(trimmedQuery)) {
        this.errorMsg = 'El ID debe ser un número.';
        return;
      }
      break;

    case 'ingredient':
      if (trimmedQuery.length > 50) {
        this.errorMsg = 'El ingrediente no puede superar los 50 caracteres.';
        return;
      }
      break;
  }

  this.loading = true;
  this.cocktails = [];

  if (this.searchType === 'name') {
    this.cocktailService.searchByName(trimmedQuery).subscribe({
      next: result => this.handleResult(result),
      error: () => this.handleError()
    });
  } else if (this.searchType === 'id') {
    this.cocktailService.searchById(+trimmedQuery).subscribe({
      next: result => this.handleResult(result),
      error: () => this.handleError()
    });
  } else if (this.searchType === 'ingredient') {
    this.cocktailService.searchByIngredient(trimmedQuery).subscribe({
      next: result => this.handleResult(result),
      error: () => this.handleError()
    });
  }
}


  handleResult(result: ApiResult<Cocktail[]>) {
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      this.cocktails = result.data;
    } else {
      this.errorMsg = 'No se encontraron resultados.';
    }
    this.loading = false;
  }

  handleError() {
    this.errorMsg = 'Error al consultar la API.';
    this.loading = false;
  }

  isFavorite(idDrink: string): boolean {
    return this.favoriteService.isFavorite(idDrink);
  }

  toggleFavorite(idDrink: string): void {
    const cocktail = this.cocktails.find(c => c.idDrink === idDrink);
    if (cocktail) {
      this.favoriteService.toggleFavorite(cocktail);
    }
  }

  openDetails(cocktail: Cocktail): void {
    this.dialog.open(CocktailDetailComponent, {
      width: '500px',
      data: { cocktail }
    });
  }

  toggleView(): void {
    this.showFavorites = !this.showFavorites;
    this.errorMsg = null;
    this.cocktails = [];
    if (this.showFavorites) {
      const favs = this.favoriteService.getFavorites();
      if (favs.length > 0) {
        this.cocktails = favs;
        this.query="";
      } else {
        this.query="";
        this.cocktails = [];
        this.errorMsg = 'No tienes cócteles favoritos aún.';
      }
    }
  }

  get helpText(): string {
  switch (this.searchType) {
    case 'name':
      return 'Ingresa el nombre del cóctel (máx. 50 caracteres).';
    case 'id':
      return 'Ingresa el ID del cóctel (solo números).';
    case 'ingredient':
      return 'Ingresa un ingrediente para buscar cócteles que lo contengan (máx. 50 caracteres).';
    default:
      return '';
  }
}


  searchType: 'name' | 'id' | 'ingredient' = 'name';
}
