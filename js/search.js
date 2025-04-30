import { recipes } from '/-TheTastyJournal/data.js';

export function setupSearch() {
  // Get search input elements
  const searchInput = document.getElementById('search-input');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  const searchBtn = document.getElementById('search-btn');
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  
  // Function to perform search
  function performSearch(searchTerm) {
    // Redirect to recipes page with search query
    window.location.href = `/pages/recipes.html?search=${encodeURIComponent(searchTerm)}`;
  }
  
  // Add event listeners for search button clicks
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      if (searchInput && searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      }
    });
  }
  
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', () => {
      if (mobileSearchInput && mobileSearchInput.value.trim()) {
        performSearch(mobileSearchInput.value.trim());
      }
    });
  }
  
  // Add event listeners for Enter key press
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      }
    });
  }
  
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && mobileSearchInput.value.trim()) {
        performSearch(mobileSearchInput.value.trim());
      }
    });
  }
  
  // Check if we're on the recipes page and handle search results
  function handleSearchResults() {
    // Only run on the recipes page
    if (!window.location.pathname.includes('/pages/recipes.html')) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const searchResultsContainer = document.getElementById('search-results');
    const searchResultsTitle = document.getElementById('search-results-title');
    
    if (searchQuery && searchResultsContainer && searchResultsTitle) {
      // Filter recipes based on search query
      const filteredRecipes = filterRecipes(searchQuery);
      
      // Update search results title
      searchResultsTitle.textContent = `Search Results for "${searchQuery}"`;
      
      // Display search results or no results message
      if (filteredRecipes.length > 0) {
        renderRecipes(searchResultsContainer, filteredRecipes);
      } else {
        searchResultsContainer.innerHTML = `
          <div class="no-results">
            <p>No recipes found matching "${searchQuery}"</p>
            <a href="/pages/recipes.html" class="btn btn-secondary">View All Recipes</a>
          </div>
        `;
      }
    }
  }
  
  // Filter recipes based on search query
  function filterRecipes(query) {
    query = query.toLowerCase();
    
    return recipes.filter(recipe => {
      return (
        recipe.title.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query) ||
        recipe.excerpt.toLowerCase().includes(query) ||
        recipe.content.toLowerCase().includes(query) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    });
  }
  
  // Render recipes to container
  function renderRecipes(container, recipesList) {
    container.innerHTML = '';
    
    recipesList.forEach(recipe => {
      const articleElement = document.createElement('article');
      articleElement.className = 'article-card';
      
      articleElement.innerHTML = `
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
          <a href="/pages/recipes.html=${recipe.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      `;
      
      container.appendChild(articleElement);
    });
  }
  
  // Run handleSearchResults on page load
  document.addEventListener('DOMContentLoaded', handleSearchResults);
}