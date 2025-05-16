// Category data
export let categories = [];

export function loadCategoriesFromCSV(callback) {
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
      callback(); // Run the rest after loading
    },
    error: function(err) {
      console.error('Failed to load CSV:', err);
    }
  });
}

// Recipe data
export let recipes = []; // Will be loaded from CSV

export function loadRecipesFromCSV(callback) {
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
        tags: recipe.tags.split(',').map(tag => tag.trim()),
        views: Number(recipe.views),
      }));
      callback();
    },
    error: function(err) {
      console.error('Failed to load recipes CSV:', err);
    }
  });
}


