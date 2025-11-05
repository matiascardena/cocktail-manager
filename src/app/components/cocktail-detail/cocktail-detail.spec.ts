import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailDetail } from './cocktail-detail';

describe('CocktailDetail', () => {
  let component: CocktailDetail;
  let fixture: ComponentFixture<CocktailDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
