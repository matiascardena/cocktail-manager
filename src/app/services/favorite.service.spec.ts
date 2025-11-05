import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';
import { Cocktail } from '../models/cocktail.model';

describe('FavoriteService', () => {
  let service: FavoriteService;
  const mockCocktail: Cocktail = { idDrink: '1', strDrink: 'Mojito', strCategory: '', strAlcoholic: '', strGlass: '', strInstructions: '', strDrinkThumb: '' };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a cocktail to favorites', () => {
    const result = service.toggleFavorite(mockCocktail);
    expect(result).toBeTrue();
    expect(service.getFavorites()).toContain(mockCocktail);
  });

  it('should remove a cocktail from favorites', () => {
    service.toggleFavorite(mockCocktail); // add first
    const result = service.toggleFavorite(mockCocktail); // remove
    expect(result).toBeFalse();
    expect(service.getFavorites()).not.toContain(mockCocktail);
  });

  it('should correctly identify if a cocktail is favorite', () => {
    service.toggleFavorite(mockCocktail);
    expect(service.isFavorite(mockCocktail.idDrink)).toBeTrue();
    service.toggleFavorite(mockCocktail);
    expect(service.isFavorite(mockCocktail.idDrink)).toBeFalse();
  });

  it('should update favorites$ observable', (done) => {
    service.getFavorites$().subscribe(favs => {
      if (favs.length === 1) {
        expect(favs).toContain(mockCocktail);
        done();
      }
    });
    service.toggleFavorite(mockCocktail);
  });

  it('should update favoritesCount$ observable', (done) => {
    service.getFavoritesCount$().subscribe(count => {
      if (count === 1) {
        expect(count).toBe(1);
        done();
      }
    });
    service.toggleFavorite(mockCocktail);
  });

  it('should persist favorites in localStorage', () => {
    service.toggleFavorite(mockCocktail);
    const stored = JSON.parse(localStorage.getItem(service.STORAGE_KEY)!);
    expect(stored).toContain(jasmine.objectContaining({ idDrink: '1' }));
  });

});
