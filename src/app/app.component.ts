import { Component } from '@angular/core';
import { CocktailListComponent } from './components/cocktail-list/cocktail-list';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CocktailListComponent,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {}
