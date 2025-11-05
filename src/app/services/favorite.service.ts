import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cocktail } from '../models/cocktail.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'favorites';
  private favorites: Cocktail[] = [];
  private favoritesCount$ = new BehaviorSubject<number>(0);

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.favorites = data ? JSON.parse(data) : [];
    this.favoritesCount$.next(this.favorites.length);
  }

  private saveFavorites(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
    this.favoritesCount$.next(this.favorites.length);
  }

  getFavorites(): Cocktail[] {
    return [...this.favorites];
  }

  isFavorite(idDrink: string): boolean {
    return this.favorites.some(f => f.idDrink === idDrink);
  }

  toggleFavorite(cocktail: Cocktail): boolean {
    const index = this.favorites.findIndex(f => f.idDrink === cocktail.idDrink);
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      return false;
    } else {
      this.favorites.push(cocktail);
      this.saveFavorites();
      return true;
    }
  }

  getFavoritesCount$() {
    return this.favoritesCount$.asObservable();
  }
}
