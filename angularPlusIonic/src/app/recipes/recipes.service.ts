import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private recipes: Recipe[] = [
    {
      id: '1',
      title: 'Pizza',
      imageUrl: 'https://irecetasfaciles.com/wp-content/uploads/2019/08/pizza-de-jamon-queso-y-tocino.jpg',
      ingredients: ['tomato', 'mozzarella']
    },
    {
      id: '2',
      title: 'Hamburger',
      imageUrl: 'https://assets.epicurious.com/photos/57c5c6d9cf9e9ad43de2d96e/master/pass/the-ultimate-hamburger.jpg',
      ingredients: ['bread', 'meat', 'tomato']
    },
  ];

  constructor() { }

  getAllRecipes(): Recipe[]{
    return [...this.recipes];
  }

  getRecipeById(recipeId: string): Recipe{
    return {...this.recipes.find(recipe => {
      return recipe.id === recipeId;
    })};
  }

  removeRecipe(recipeId: string){
    this.recipes = this.recipes.filter(recipe =>{
      return recipe.id !== recipeId;
    })
  }
}
