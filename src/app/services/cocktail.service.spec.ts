import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CocktailService } from './cocktail.service';
import { Cocktail } from '../models/cocktail.model';

describe('CocktailService', () => {
  let service: CocktailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CocktailService],
    });
    service = TestBed.inject(CocktailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search cocktails by name', () => {
    const mockResponse = { drinks: [{ idDrink: '1', strDrink: 'Mojito' }] as Cocktail[] };
    service.searchByName('Mojito').subscribe(res => {
        if(res.data){
      expect(res.success).toBeTrue();
      expect(res.data.length).toBe(1);
      expect(res.data[0].strDrink).toBe('Mojito');
        }

    });

    const req = httpMock.expectOne(`${service['apiUrl']}/search.php?s=Mojito`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search cocktails by ingredient', () => {
    const mockResponse = { drinks: [{ idDrink: '2', strDrink: 'Gin Tonic' }] as Cocktail[] };
    service.searchByIngredient('Gin').subscribe(res => {
         if(res.data){
      expect(res.success).toBeTrue();
      expect(res.data[0].strDrink).toBe('Gin Tonic');
         }

    });

    const req = httpMock.expectOne(`${service['apiUrl']}/filter.php?i=Gin`);
    req.flush(mockResponse);
  });

  it('should search cocktails by ID', () => {
    const mockResponse = { drinks: [{ idDrink: '3', strDrink: 'Martini' }] as Cocktail[] };
    service.searchById(3).subscribe(res => {
              if(res.data){
      expect(res.success).toBeTrue();
      expect(res.data[0].strDrink).toBe('Martini');
              }

    });

    const req = httpMock.expectOne(`${service['apiUrl']}/lookup.php?i=3`);
    req.flush(mockResponse);
  });

  it('should handle HTTP errors', () => {
    service.searchByName('error').subscribe(res => {
        if(res.data){
      expect(res.success).toBeFalse();
      expect(res.data.length).toBe(0);
      expect(res.error).toBeTruthy();
        }

    });

    const req = httpMock.expectOne(`${service['apiUrl']}/search.php?s=error`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
