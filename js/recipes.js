import { setupSearch } from './search.js';
import { setupNewsletter } from './newsletter.js';
import { db, collection, getDocs, query, where } from './firebase-config.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const allRecipesContainer = document.getElementById('all-recipes-container');
const singleRecipeSection = document.getElementById('single-recipe-section');
const searchResultsSection = document.getElementById('search-results-section');

// Loading state
const loadingSpinner = document.createElement('div');
loadingSpinner.className = 'loading-spinner';
loadingSpinner.innerHTML = '<div class="spinner"></div>';

// Mobile Navigation Toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
  });
}

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  if (mobileNav.classList.contains('active') && 
      !mobileNav.contains(e.target) && 
      !hamburger.contains(e.target)) {
    mobileNav.classList.remove('active');
    document.body.classList.remove('no-scroll');
    
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.remove('active'));
  }
});

// Header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Initialize search functionality
setupSearch();

// Initialize newsletter functionality
setupNewsletter();

// Fetch and display recipes
async function displayRecipes(categoryFilter = null) {
  if (!allRecipesContainer) return;
  
  allRecipesContainer.appendChild(loadingSpinner);
  
  try {
    let recipesQuery;
    if (categoryFilter) {
      recipesQuery = query(
        collection(db, 'recipes'),
        where('category', '==', categoryFilter)
      );
    } else {
      recipesQuery = collection(db, 'recipes');
    }
    
    const recipesSnapshot = await getDocs(recipesQuery);
    allRecipesContainer.innerHTML = '';
    
    if (recipesSnapshot.empty) {
      allRecipesContainer.innerHTML = `
        <div class="no-recipes">
          <p>No recipes found${categoryFilter ? ` in category "${categoryFilter}"` : ''}.</p>
          ${categoryFilter ? `<a href="/pages/recipes.html" class="btn btn-secondary">View All Recipes</a>` : ''}
        </div>
      `;
      return;
    }
    
    recipesSnapshot.forEach(doc => {
      const recipe = doc.data();
      const recipeElement = document.createElement('article');
      recipeElement.className = 'article-card';
      
      recipeElement.innerHTML = `
        <div class="article-img">
          <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
        </div>
        <div class="article-content">
          <div class="article-meta">
            <span class="article-category">${recipe.category}</span>
            <span class="article-date">${recipe.date}</span>
          </div>
          <h3 class="article-title">${recipe.title}</h3>
          <p class="article-excerpt">${recipe.description}</p>
          <a href="/pages/recipe-post.html?slug=${recipe.slug}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      `;
      
      allRecipesContainer.appendChild(recipeElement);
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    allRecipesContainer.innerHTML = `
      <div class="error-message">
        <p>Failed to load recipes. Please try again later.</p>
      </div>
    `;
  }
}

// Handle URL parameters
function handleUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchQuery = urlParams.get('search');
  
  if (searchQuery) {
    if (allRecipesSection) allRecipesSection.style.display = 'none';
    if (searchResultsSection) searchResultsSection.style.display = 'block';
    if (singleRecipeSection) singleRecipeSection.style.display = 'none';
  } else {
    if (allRecipesSection) allRecipesSection.style.display = 'block';
    if (searchResultsSection) searchResultsSection.style.display = 'none';
    if (singleRecipeSection) singleRecipeSection.style.display = 'none';
    
    displayRecipes(categoryParam);
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  handleUrlParams();
});