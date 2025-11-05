import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResult, Cocktail } from '../models/cocktail.model';

interface TheCocktailDBResponse {
  drinks: Cocktail[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class CocktailService {
  private apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1';

  constructor(private http: HttpClient) {}

  searchByName(name: string): Observable<ApiResult<Cocktail[]>> {
    const url = `${this.apiUrl}/search.php?s=${name}`;
    return this.getDrinks(url);
  }

  searchByIngredient(ingredient: string): Observable<ApiResult<Cocktail[]>> {
    const url = `${this.apiUrl}/filter.php?i=${ingredient}`;
    return this.getDrinks(url);
  }

  searchById(id: number): Observable<ApiResult<Cocktail[]>> {
    const url = `${this.apiUrl}/lookup.php?i=${id}`;
    return this.getDrinks(url);
  }

  private getDrinks(url: string): Observable<ApiResult<Cocktail[]>> {
    return this.http.get<TheCocktailDBResponse>(url).pipe(
      map(response => {
        return {
          success: true,
          data: response.drinks ?? [],
          error: undefined
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return of({
          success: false,
          data: [],
          error: error.message || 'Error desconocido'
        });
      })
    );
  }
}
