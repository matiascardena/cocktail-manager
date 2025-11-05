import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Cocktail } from '../../models/cocktail.model';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-cocktail-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './cocktail-detail.html',
  styleUrls: ['./cocktail-detail.scss']
})
export class CocktailDetailComponent implements OnInit {
  loading = true;
  cocktailData!: Cocktail;
  imageLoaded = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cocktail: Cocktail },
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    // Simula carga con spinner
    setTimeout(() => {
      this.cocktailData = this.data.cocktail;
      this.loading = false;
    }, 300);
  }

  getIngredients() {
    if (!this.cocktailData) return [];
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const name = this.cocktailData[`strIngredient${i}` as keyof Cocktail];
      const measure = this.cocktailData[`strMeasure${i}` as keyof Cocktail];
      if (name) ingredients.push({ name, measure });
    }
    return ingredients;
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  isFavorite(): boolean {
    return this.favoriteService.isFavorite(this.cocktailData.idDrink);
  }

  toggleFavorite(): void {
    this.favoriteService.toggleFavorite(this.cocktailData);
  }
}
