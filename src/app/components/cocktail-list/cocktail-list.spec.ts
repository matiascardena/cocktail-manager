import { TestBed } from '@angular/core/testing';
import { CocktailListComponent } from './cocktail-list';
import { CocktailService } from '../../services/cocktail.service';
import { MatDialogModule } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';

describe('CocktailListComponent', () => {
  let component: CocktailListComponent;
  let fixture: any;
  let mockCocktailService: any;

  beforeEach(async () => {
    mockCocktailService = {
      searchByName: jasmine.createSpy('searchByName').and.returnValue(of([{ name: 'Mojito' }])),
      searchById: jasmine.createSpy('searchById').and.returnValue(of({ name: 'Mojito' })),
      searchByIngredient: jasmine.createSpy('searchByIngredient').and.returnValue(of([{ name: 'Mojito' }]))
    };

    await TestBed.configureTestingModule({
      imports: [CocktailListComponent, MatDialogModule],
      providers: [{ provide: CocktailService, useValue: mockCocktailService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open cocktail details dialog', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.openDetails(component.cocktails[0]);
    expect(component.dialog.open).toHaveBeenCalled();
  });
});
