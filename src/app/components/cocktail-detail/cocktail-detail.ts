import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Cocktail } from '../../models/cocktail.model';
import { FavoriteService } from '../../services/favorite.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule,  MatIconModule],
  templateUrl: './cocktail-detail.html',
  styleUrls: ['./cocktail-detail.scss']
})
export class CocktailDetailComponent implements OnInit {
  loading = true;
  cocktailData!: Cocktail;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { cocktail: Cocktail }, private favoriteService: FavoriteService) {}

  ngOnInit() {
    setTimeout(() => {
      this.cocktailData = this.data.cocktail;
      this.loading = false;
    }, 300); // 300ms para que se vea el spinner
  }

  getIngredients() {
    if (!this.cocktailData) return [];
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const name = this.cocktailData[`strIngredient${i}` as keyof Cocktail];
      const measure = this.cocktailData[`strMeasure${i}` as keyof Cocktail];
      if (name) {
        ingredients.push({ name, measure });
      }
    }
    return ingredients;
  }

  imageLoaded = false;

onImageLoad() {
  this.imageLoaded = true;
}

isFavorite(id: string): boolean {
  return this.favoriteService.isFavorite(id);
}

toggleFavorite(): void {
  this.favoriteService.toggleFavorite(this.cocktailData);
}

}
