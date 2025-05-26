import { loadRecipesFromCSV, recipes } from './data.js';

export function setupSearch() {
  const searchInputs = [
    document.getElementById('search-input'),
    document.getElementById('mobile-search-input'),
    document.getElementById('hero-search-input')
  ].filter(Boolean);

  const searchButtons = [
    document.getElementById('search-btn'),
    document.getElementById('mobile-search-btn'),
    document.getElementById('hero-search-btn')
  ].filter(Boolean);

  function performSearch(searchTerm) {
    window.location.href = `/pages/search-results.html?search=${encodeURIComponent(searchTerm)}`;
  }

  // Attach click event to each button
  searchButtons.forEach((btn, index) => {
    const relatedInput = searchInputs[index] || searchInputs[0];
    btn.addEventListener('click', () => {
      const term = relatedInput.value.trim();
      if (term) performSearch(term);
    });
  });

  // Attach Enter key event to each input
  searchInputs.forEach(input => {
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        const term = input.value.trim();
        if (term) performSearch(term);
      }
    });
  });

  // Display search results if on search-results.html
  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (!searchQuery || !window.location.pathname.includes('/pages/search-results.html')) return;

    const searchResultsContainer = document.getElementById('search-results');
    const searchResultsTitle = document.getElementById('search-results-title');

    loadRecipesFromCSV().then(() => {
      const query = searchQuery.toLowerCase();
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query) ||
        recipe.excerpt.toLowerCase().includes(query) ||
        recipe.content.toLowerCase().includes(query) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query)))
      );

      searchResultsTitle.textContent = `Search Results for "${searchQuery}"`;

      if (filtered.length > 0) {
        renderRecipes(searchResultsContainer, filtered);
      } else {
        searchResultsContainer.innerHTML = `
          <div class="no-results">
            <p>No recipes found matching "${searchQuery}"</p>
            <a href="/pages/recipes.html" class="btn btn-secondary">View All Recipes</a>
          </div>
        `;
      }
    });
  });
}

function renderRecipes(container, recipesList) {
  container.innerHTML = '';

  recipesList.forEach(recipe => {
    const article = document.createElement('article');
    article.className = 'article-card';
    article.innerHTML = `
      <div class="article-img">
        <img src="${recipe.image}" alt="${recipe.title}">
      </div>
      <div class="article-content">
        <div class="article-meta">
          <span class="article-category">${recipe.category}</span>
          <span class="article-date">${recipe.date}</span>
        </div>
        <h3 class="article-title">${recipe.title}</h3>
        <p class="article-excerpt">${recipe.excerpt}</p>
        <a href="/pages/recipe-post.html?id=${recipe.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
      </div>
    `;
    container.appendChild(article);
  });
}

setupSearch();
