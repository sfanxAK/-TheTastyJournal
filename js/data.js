import Papa from 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js';

export let recipes = [];
export let categories = [];

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
        tags: recipe.tags ? recipe.tags.split(',').map(tag => tag.trim()) : [],
        views: Number(recipe.views),
      }));

      // Generate unique categories based on recipe data
      const categoryMap = new Map();
      recipes.forEach(recipe => {
        if (!categoryMap.has(recipe.category)) {
          categoryMap.set(recipe.category, {
            name: recipe.category,
            image: recipe.image, // fallback
          });
        }
      });
      categories = Array.from(categoryMap.values());

      callback();
    },
    error: function(err) {
      console.error('Failed to load recipes CSV:', err);
    }
  });
}
