import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CocktailListComponent } from './cocktail-list';
import { CocktailService } from '../../services/cocktail.service';
import { FavoriteService } from '../../services/favorite.service';
import { Cocktail } from '../../models/cocktail.model';

describe('CocktailListComponent', () => {
  let component: CocktailListComponent;
  let fixture: ComponentFixture<CocktailListComponent>;
  let mockCocktailService: any;
  let mockDialog: any;
  let mockFavoriteService: any;

  const mockCocktail: Cocktail = {
    idDrink: '1',
    strDrink: 'Mojito',
    strCategory: 'Cocktail',
    strAlcoholic: 'Alcoholic',
    strGlass: 'Highball glass',
    strInstructions: 'Mix ingredients with ice and serve.',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg'
  };

  beforeEach(async () => {
    mockCocktailService = {
      searchByName: jasmine.createSpy('searchByName').and.callFake((name: string, page: number = 1) => {
        const drinks = [
          { ...mockCocktail, idDrink: '1', strDrink: 'Mojito' },
          { ...mockCocktail, idDrink: '2', strDrink: 'Daiquiri' },
          { ...mockCocktail, idDrink: '3', strDrink: 'Martini' }
        ];
        const start = (page - 1) * 1;
        const end = start + 1;
        return of({ success: true, data: drinks.slice(start, end) });
      }),
      searchByIngredient: jasmine.createSpy('searchByIngredient').and.returnValue(of({ success: true, data: [mockCocktail] })),
      searchById: jasmine.createSpy('searchById').and.returnValue(of({ success: true, data: [mockCocktail] }))
    };

    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(null)
      })
    };

    mockFavoriteService = {
      getFavoritesCount$: () => of(1),
      getFavorites$: () => of([]),
      getFavorites: () => [],
      toggleFavorite: jasmine.createSpy('toggleFavorite'),
      isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false),
      STORAGE_KEY: 'favorites'
    };

    await TestBed.configureTestingModule({
      imports: [CocktailListComponent, HttpClientTestingModule],
      providers: [
        { provide: CocktailService, useValue: mockCocktailService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: FavoriteService, useValue: mockFavoriteService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailListComponent);
    component = fixture.componentInstance;

    component.cocktails = [{ ...mockCocktail, idDrink: '1' }];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should search cocktails by name successfully', () => {
    component.query = 'Mojito';
    component.searchType = 'name';
    component.search();

    expect(mockCocktailService.searchByName).toHaveBeenCalledWith('Mojito', 1, component.pageSize);
    expect(component.cocktails.length).toBe(1);
    expect(component.cocktails[0].strDrink).toBe('Mojito');
  });

  it('should handle search errors gracefully', () => {
    mockCocktailService.searchByName.and.returnValue(throwError(() => ({ status: 500, message: 'Server Error' })));
    component.query = 'Mojito';
    component.searchType = 'name';
    component.search();

    expect(component.errorMsg).toBeTruthy();
  });

  it('should show error if search query is empty', () => {
    component.query = '';
    component.searchType = 'name';
    component.search();

    expect(component.errorMsg).toBe('Debes ingresar un valor de búsqueda.');
  });

  it('should validate long query', () => {
    component.query = 'x'.repeat(51);
    component.searchType = 'name';
    component.search();

    expect(component.errorMsg).toBe('El nombre no puede superar los 50 caracteres.');
  });

  it('should validate ID query', () => {
    component.query = 'abc';
    component.searchType = 'id';
    component.search();

    expect(component.errorMsg).toBe('El ID debe ser un número.');
  });

  it('should toggle view to favorites', () => {
    component.toggleView();
    expect(component.showFavorites).toBeTrue();
    expect(component.errorMsg).toBe('No tienes cócteles favoritos aún.');
  });

  it('should handle onSearchTypeChange', () => {
    component.query = 'test';
    component.onSearchTypeChange('id');
    expect(component.searchType).toBe('id');
    expect(component.query).toBe('');
  });

});
