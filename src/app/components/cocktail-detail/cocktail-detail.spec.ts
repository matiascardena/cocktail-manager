// cocktail-detail.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CocktailDetailComponent } from './cocktail-detail';
import { FavoriteService } from '../../services/favorite.service';
import { Cocktail } from '../../models/cocktail.model';

describe('CocktailDetailComponent', () => {
  let component: CocktailDetailComponent;
  let fixture: ComponentFixture<CocktailDetailComponent>;
  let mockFavoriteService: jasmine.SpyObj<FavoriteService>;

  // Cocktail con 15 ingredientes
  const mockCocktail: Cocktail = {
    idDrink: '1',
    strDrink: 'Margarita',
    strDrinkThumb: 'thumb1.jpg',
    strCategory: 'Cocktail',
    strAlcoholic: 'Alcoholic',
    strGlass: 'Cocktail glass',
    strInstructions: 'Mix ingredients',
  } as any;

  // Añadimos 15 ingredientes y medidas
  for (let i = 1; i <= 15; i++) {
    mockCocktail[`strIngredient${i}` as keyof Cocktail] = `Ingredient${i}`;
    mockCocktail[`strMeasure${i}` as keyof Cocktail] = `${i * 10}ml`;
  }

  beforeEach(async () => {
    mockFavoriteService = jasmine.createSpyObj('FavoriteService', ['isFavorite', 'toggleFavorite']);
    mockFavoriteService.isFavorite.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [CocktailDetailComponent, MatDialogModule],
      providers: [
        { provide: FavoriteService, useValue: mockFavoriteService },
        { provide: MAT_DIALOG_DATA, useValue: { cocktail: mockCocktail } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load cocktail data on init', fakeAsync(() => {
    component.ngOnInit();
    tick(300);
    expect(component.cocktailData).toEqual(mockCocktail);
    expect(component.loading).toBeFalse();
  }));

  it('should return all 15 ingredients correctly', fakeAsync(() => {
    component.ngOnInit();
    tick(300);
    const ingredients = component.getIngredients();
    expect(ingredients.length).toBe(15);
    ingredients.forEach((ing, index) => {
      expect(ing).toEqual({ name: `Ingredient${index + 1}`, measure: `${(index + 1) * 10}ml` });
    });
  }));

  it('should return empty array if cocktailData is undefined', () => {
    component.cocktailData = undefined as any;
    const ingredients = component.getIngredients();
    expect(ingredients).toEqual([]);
  });

  it('should set imageLoaded to true on onImageLoad', () => {
    expect(component.imageLoaded).toBeFalse();
    component.onImageLoad();
    expect(component.imageLoaded).toBeTrue();
  });

  it('should call favoriteService.isFavorite in isFavorite', fakeAsync(() => {
    component.ngOnInit();
    tick(300);
    const result = component.isFavorite();
    expect(mockFavoriteService.isFavorite).toHaveBeenCalledWith(mockCocktail.idDrink);
    expect(result).toBeFalse();
  }));

  it('should call favoriteService.toggleFavorite in toggleFavorite', fakeAsync(() => {
    component.ngOnInit();
    tick(300);
    component.toggleFavorite();
    expect(mockFavoriteService.toggleFavorite).toHaveBeenCalledWith(mockCocktail);
  }));
});
