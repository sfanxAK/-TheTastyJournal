// Recipe data
export let recipes = []; // Will be loaded from CSV

export function loadRecipesFromCSV(callback) {
  Papa.parse('https://sfanxak.github.io/-TheTastyJournal/data/recipes.csv', {
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
