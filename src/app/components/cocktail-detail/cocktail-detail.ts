import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Cocktail } from '../../models/cocktail.model';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './cocktail-detail.html',
  styleUrls: ['./cocktail-detail.scss']
})
export class CocktailDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { cocktail: Cocktail }) {}

  getIngredients() {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const name = this.data.cocktail[`strIngredient${i}` as keyof Cocktail];
    const measure = this.data.cocktail[`strMeasure${i}` as keyof Cocktail];
    if (name) {
      ingredients.push({ name, measure });
    }
  }
  return ingredients;
}

}
