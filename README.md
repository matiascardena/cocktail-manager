# CocktailManager

# Description

**CocktailManager** is an Angular 20 [Angular CLI](https://github.com/angular/angular-cli) 
Application that allows users to search, view, and manage cocktails using the public [TheCocktailDB](https://www.thecocktaildb.com/) API.  
It supports searching by name, ingredient, or ID, viewing cocktail details, managing favorites, and gracefully handling loading and error states.

---

## Main Features

-  **Dynamic search** by cocktail name, ingredient, or ID  
-  **Favorites management** via `FavoriteService` using local storage  
-  **RetryInterceptor** to automatically retry HTTP 500 errors  
-  **Modern UI** built with Angular Material and standalone components  
-  **Unit testing** using Karma + Jasmine with >60% coverage  
-  **Docker support** for easy setup and reproducible environments  

---

## Technologies Used

- Framework Angular 20 
- Language  TypeScript 
- UI Library Angular Material
- Testing Karma + Jasmine
- HTTP HttpClient + RetryInterceptor
- Reactive Programming  RxJS
- Build Tool Webpack (Angular CLI)

---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Running tests

To execute tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
- Code coverage: 80%
- Coverage Report (Karma): /coverage/cocktail-manager/index.html
- Details Tesitn Karma: DetailTestingKarma.pdf


## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
