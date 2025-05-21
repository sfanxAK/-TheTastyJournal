// Category data
export let categories = [];

export function loadCategoriesFromCSV(callback) {
  return new Promise((resolve, reject) => {
    Papa.parse('../data/categories.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        categories = results.data.map(cat => ({
          id: Number(cat.id),
          name: cat.name,
          description: cat.description,
          image: cat.image
        }));
        callback();
      },
      error: function(err) {
        console.error('Failed to load categories CSV:', err);
      }
    });
  });
}


// Recipe data
export let recipes = []; // Will be loaded from CSV

export function loadRecipesFromCSV() {
  return new Promise((resolve, reject) => {
    Papa.parse('../data/recipes.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        recipes = results.data.map(recipe => ({
          id: Number(recipe.id),
          title: recipe.title,
          excerpt: recipe.excerpt,
          content: recipe.content,
          date: recipe.date,
          image: recipe.image,
          category: recipe.category,
          tags: recipe.tags?.split(',').map(tag => tag.trim()) || [],
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          totalTime: recipe.totalTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty
        }));
        resolve(); // ✅ Resolve when done
      },
      error: function(err) {
        console.error('Failed to load recipes CSV:', err);
        reject(err);
      }
    });
  });
}

export function loadRecipePost() {
  const recipeId = getQueryParam("id");
  fetch("../data/recipes.csv")
      .then(response => response.text())
      .then(csv => {
          const results = Papa.parse(csv, {
              header: true,
              skipEmptyLines: true
          });
          const recipe = results.data.find(r => Number(r.id) === Number(recipeId));
          renderRecipePost(recipe);
      })
      .catch(error => {
          console.error("Error loading recipe:", error);
          document.getElementById("recipe-post").innerHTML = "<p>Error loading recipe.</p>";
      });
}



