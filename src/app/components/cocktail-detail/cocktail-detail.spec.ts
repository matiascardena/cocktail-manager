import { TestBed } from '@angular/core/testing';
import { CocktailDetailComponent } from './cocktail-detail';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('CocktailDetailComponent', () => {
  let component: CocktailDetailComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailDetailComponent, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { cocktail: { name: 'Mojito' } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CocktailDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
