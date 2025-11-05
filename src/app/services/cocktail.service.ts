import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cocktail, CocktailApiResponse, ApiResult } from '../models/cocktail.model';

@Injectable({ providedIn: 'root' })
export class CocktailService {
  private readonly API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

  constructor(private http: HttpClient) {}

  searchByName(name: string): Observable<ApiResult<Cocktail[]>> {
    return this.http
      .get<CocktailApiResponse>(`${this.API_URL}search.php?s=${name}`)
      .pipe(
        map(res => ({
          data: res.drinks || [],
          success: true,
          status: 200
        })),
        catchError((err: HttpErrorResponse) =>
          of({
            data: null,
            success: false,
            error: err.message,
            status: err.status
          })
        )
      );
  }

  searchByIngredient(ingredient: string): Observable<ApiResult<Cocktail[]>> {
    return this.http
      .get<CocktailApiResponse>(`${this.API_URL}filter.php?i=${ingredient}`)
      .pipe(
        map(res => ({
          data: res.drinks || [],
          success: true,
          status: 200
        })),
        catchError((err: HttpErrorResponse) =>
          of({
            data: null,
            success: false,
            error: err.message,
            status: err.status
          })
        )
      );
  }

  getById(id: number): Observable<ApiResult<Cocktail[]>> {
    return this.http
      .get<CocktailApiResponse>(`${this.API_URL}lookup.php?i=${id}`)
      .pipe(
        map(res => ({
          data: res.drinks || [],
          success: true,
          status: 200
        })),
        catchError((err: HttpErrorResponse) =>
          of({
            data: null,
            success: false,
            error: err.message,
            status: err.status
          })
        )
      );
  }
}
