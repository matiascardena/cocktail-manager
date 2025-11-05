/** Basic cocktail model according to TheCocktailDB */
export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strDrinkThumb: string;
  [key: string]: any; // para campos dinámicos (ingredientes, etc.)
}

/** General API response structure */
export interface CocktailApiResponse {
  drinks: Cocktail[] | null;
}

export interface ApiResult<T> {
  data: T | null;
  success: boolean;
  error?: string;
  status?: number;
}

