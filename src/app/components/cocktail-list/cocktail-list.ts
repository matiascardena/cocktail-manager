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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CocktailService } from '../../services/cocktail.service';
import { FavoriteService } from '../../services/favorite.service';
import { Cocktail, ApiResult } from '../../models/cocktail.model';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CocktailDetailComponent } from '../cocktail-detail/cocktail-detail';

interface SavedState {
  query: string;
  searchType: 'name' | 'id' | 'ingredient';
  page: number;
  cocktails: Cocktail[];
  scrollY: number;
}

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
    MatSelectModule,
    InfiniteScrollModule
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
  page = 1;
  pageSize = 10;
  allLoaded = false;
  totalResult = 0;

  searchType: 'name' | 'id' | 'ingredient' = 'name';

  private readonly STORAGE_KEY = 'cocktailListState';

  constructor(
    private cocktailService: CocktailService,
    public dialog: MatDialog,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    this.loadSavedState();

    // Suscripción al conteo de favoritos
    this.favoriteService.getFavoritesCount$().subscribe(count => {
      this.favoritesCount = count;
    });

    // Suscripción a cambios en favoritos
    this.favoriteService.getFavorites$().subscribe(favs => {
      if (this.showFavorites) {
        this.cocktails = favs.length > 0 ? favs : [];
        this.errorMsg = favs.length === 0 ? 'No tienes cócteles favoritos aún.' : null;
      }
    });

    // Escuchar cambios en localStorage desde otras pestañas
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY && event.newValue) {
        const state: SavedState = JSON.parse(event.newValue);
        this.query = state.query;
        this.searchType = state.searchType;
        this.page = state.page;
        this.cocktails = state.cocktails;
        setTimeout(() => window.scrollTo(0, state.scrollY || 0), 0);
      }
      if (event.key === this.favoriteService.STORAGE_KEY) {
        this.favoriteService.reloadFavoritesFromStorage();
      }
    });
  }

  private loadSavedState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const state: SavedState = JSON.parse(saved);
      this.query = state.query;
      this.searchType = state.searchType;
      this.page = state.page;
      this.cocktails = state.cocktails || [];
      setTimeout(() => window.scrollTo(0, state.scrollY || 0), 0);
    }
  }

  private saveState() {
    const state: SavedState = {
      query: this.query,
      searchType: this.searchType,
      page: this.page,
      cocktails: this.cocktails,
      scrollY: window.scrollY
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  search(reset: boolean = true): void {
    this.errorMsg = null;
    if (!this.query || this.query.trim() === '') {
      this.errorMsg = 'Debes ingresar un valor de búsqueda.';
      return;
    }
    const trimmedQuery = this.query.trim();

    // Validaciones
    switch (this.searchType) {
      case 'name':
      case 'ingredient':
        if (trimmedQuery.length > 50) {
          this.errorMsg = `El ${this.searchType === 'name' ? 'nombre' : 'ingrediente'} no puede superar los 50 caracteres.`;
          return;
        }
        break;
      case 'id':
        if (!/^\d+$/.test(trimmedQuery)) {
          this.errorMsg = 'El ID debe ser un número.';
          return;
        }
        break;
    }

    if (reset) {
      this.cocktails = [];
      this.page = 1;
      this.allLoaded = false;
    }

    this.loadPage();
  }

  loadPage(): void {
    if (this.loading || this.allLoaded) return;
    this.loading = true;
    const trimmedQuery = this.query.trim();
    let request$;
    if (this.searchType === 'name') {
      request$ = this.cocktailService.searchByName(trimmedQuery, this.page, this.pageSize);
    } else if (this.searchType === 'id') {
      request$ = this.cocktailService.searchById(+trimmedQuery);
    } else {
      request$ = this.cocktailService.searchByIngredient(trimmedQuery, this.page, this.pageSize);
    }

    request$.subscribe({
      next: (result: ApiResult<Cocktail[]>) => this.handleResult(result),
      error: () => this.handleError()
    });
  }

  handleResult(result: ApiResult<Cocktail[]>) {
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      this.cocktails.push(...result.data);
      this.totalResult += result.data.length;
      this.saveState();
    } else if (this.page === 1) {
      this.errorMsg = 'No se encontraron resultados';
    }
    this.loading = false;
  }

  handleError() {
    this.errorMsg = 'Error al consultar la API.';
    this.loading = false;
  }

  onScroll(): void {
    if (!this.loading && !this.showFavorites && !this.allLoaded) {
      this.page++;
      this.loadPage();
    }
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
  if (!this.showFavorites) {
    this.saveState();
  }

  this.showFavorites = !this.showFavorites;
  this.errorMsg = null;
  this.cocktails = [];
  this.query='';
  
  if (this.showFavorites) {
    
    const favs = this.favoriteService.getFavorites();
    if (favs.length > 0) {
      this.cocktails = favs;
    } else {
      this.errorMsg = 'No tienes cócteles favoritos aún.';
    }
  } else {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const state: SavedState = JSON.parse(saved);
      this.query = state.query;
      this.searchType = state.searchType;
      this.page = state.page;
      this.cocktails = state.cocktails || [];
      this.allLoaded = false;

      setTimeout(() => window.scrollTo(0, state.scrollY || 0), 0);
    }
  }
}


  get helpText(): string {
    switch (this.searchType) {
      case 'name':
        return 'Máx. 50 caracteres.';
      case 'id':
        return 'Solo números.';
      case 'ingredient':
        return 'Máx. 50 caracteres.';
      default:
        return '';
    }
  }

  onSearchTypeChange(newType: 'name' | 'id' | 'ingredient') {
    this.query = '';
    this.searchType = newType;
    this.saveState();
  }
}
