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

  searchByName(name: string, page: number = 1, pageSize: number = 10): Observable<ApiResult<Cocktail[]>> {
    const url = `${this.apiUrl}/search.php?s=${name}`;
    return this.getDrinks(url, page, pageSize);
  }

  searchByIngredient(ingredient: string, page: number = 1, pageSize: number = 10): Observable<ApiResult<Cocktail[]>> {
    const url = `${this.apiUrl}/filter.php?i=${ingredient}`;
    return this.getDrinks(url, page, pageSize);
  }

  searchById(id: number): Observable<ApiResult<Cocktail[]>> {
    const url = `${this.apiUrl}/lookup.php?i=${id}`;
    // No pagination needed for ID search
    return this.getDrinks(url);
  }

  private getDrinks(url: string, page: number = 1, pageSize: number = 10): Observable<ApiResult<Cocktail[]>> {
    return this.http.get<TheCocktailDBResponse>(url).pipe(
      map(response => {
        const drinks = response.drinks ?? [];
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedDrinks = drinks.slice(start, end);
        return {
          success: true,
          data: paginatedDrinks,
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
