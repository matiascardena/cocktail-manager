import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FavoriteService } from '../../services/favorite.service';
import { Cocktail } from '../../models/cocktail.model';
import { CocktailListComponent } from '../cocktail-list/cocktail-list';

// Mock data completo de Cocktail
const mockCocktails: Cocktail[] = [
  {
    idDrink: '1',
    strDrink: 'Margarita',
    strDrinkThumb: 'thumb1.jpg',
    strCategory: 'Cocktail',
    strAlcoholic: 'Alcoholic',
    strGlass: 'Cocktail glass',
    strInstructions: 'Mix ingredients',
  },
  {
    idDrink: '2',
    strDrink: 'Mojito',
    strDrinkThumb: 'thumb2.jpg',
    strCategory: 'Cocktail',
    strAlcoholic: 'Alcoholic',
    strGlass: 'Highball glass',
    strInstructions: 'Mix ingredients',
  },
];

describe('CocktailListComponent', () => {
  let component: CocktailListComponent;
  let fixture: ComponentFixture<CocktailListComponent>;
  let dialog: MatDialog;
  let mockFavoriteService: jasmine.SpyObj<FavoriteService>;

  beforeEach(async () => {
    mockFavoriteService = jasmine.createSpyObj('FavoriteService', ['getFavorites', 'getFavorites$', 'getFavoritesCount$', 'isFavorite', 'toggleFavorite']);

    // Observables simulados
    mockFavoriteService.getFavorites$ = jasmine.createSpy().and.returnValue(of([]));
    mockFavoriteService.getFavoritesCount$ = jasmine.createSpy().and.returnValue(of(0));
    mockFavoriteService.isFavorite.and.returnValue(false);
    mockFavoriteService.getFavorites.and.returnValue([]);

    await TestBed.configureTestingModule({
      imports: [CocktailListComponent, HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: FavoriteService, useValue: mockFavoriteService },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailListComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle favorite', () => {
    component.cocktails = [...mockCocktails];
    component.toggleFavorite('1');
    expect(mockFavoriteService.toggleFavorite).toHaveBeenCalledWith(mockCocktails[0]);
  });

  it('should open dialog on openDetails', () => {
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(null) } as any);
    component.openDetails(mockCocktails[0]);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should load next page on scroll', fakeAsync(() => {
    const mockService = TestBed.inject(FavoriteService);
    // Simulamos el método de carga de Cocktails en el service
    spyOn((component as any).cocktailService, 'searchByName').and.returnValue(of(mockCocktails));
    component.query = 'Margarita';
    component.searchType = 'name';
    component.onScroll();
    tick();
    expect(component.cocktails.length).toBe(mockCocktails.length);
  }));

  it('should set errorMsg when search query is empty', () => {
    component.query = '';
    component.search();
    expect(component.errorMsg).toBe('Debes ingresar un valor de búsqueda.');
  });

  it('should reset query when searchType changes', () => {
    component.query = 'Test';
    component.onSearchTypeChange('ingredient');
    expect(component.query).toBe('');
    expect(component.searchType).toBe('ingredient');
  });

  it('should display helpText according to searchType', () => {
    component.searchType = 'name';
    expect(component.helpText).toBe('Máx. 50 caracteres.');
    component.searchType = 'id';
    expect(component.helpText).toBe('Solo números.');
    component.searchType = 'ingredient';
    expect(component.helpText).toBe('Máx. 50 caracteres.');
  });
});
