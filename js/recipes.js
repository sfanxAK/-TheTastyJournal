import { recipes, categories, loadRecipesFromCSV } from './data.js';
import { setupSearch } from './search.js';
import { setupNewsletter } from './newsletter.js';

let categories = []; // Will be filled from CSV


// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const categoriesContainer = document.getElementById('categories-container');
const allRecipesContainer = document.getElementById('all-recipes-container');
const singleRecipeSection = document.getElementById('single-recipe-section');
const singleRecipeContainer = document.getElementById('single-recipe-container');
const allRecipesSection = document.getElementById('all-recipes-section');
const searchResultsSection = document.getElementById('search-results-section');

// Mobile Navigation Toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
  });
}

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

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

setupSearch();
setupNewsletter();

// Display categories
function displayCategories() {
  if (!categoriesContainer || !categories) return;
  categoriesContainer.innerHTML = '';
  categories.forEach(category => {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-item';
    categoryElement.innerHTML = `
      <div class="category-img">
        <img src="${category.image}" alt="${category.name}">
      </div>
      <h3>${category.name}</h3>
      <a href="/pages/categories.html?category=${encodeURIComponent(category.name.toLowerCase())}" class="category-link">View Recipes</a>
    `;
    categoriesContainer.appendChild(categoryElement);
  });
}

// Display all recipes
function displayAllRecipes() {
  if (!allRecipesContainer || !recipes) return;
  allRecipesContainer.innerHTML = '';
  recipes.forEach(recipe => {
    const recipeElement = document.createElement('article');
    recipeElement.className = 'article-card';
    recipeElement.innerHTML = `
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
        <a href="/pages/recipes.html?id=${recipe.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
      </div>
    `;
    allRecipesContainer.appendChild(recipeElement);
  });
}

// Display a single recipe
function displaySingleRecipe(recipeId) {
  const recipe = recipes.find(r => r.id === parseInt(recipeId));
  if (!recipe || !singleRecipeContainer) return;

  allRecipesSection?.style?.display = 'none';
  searchResultsSection?.style?.display = 'none';
  singleRecipeSection.style.display = 'block';
  document.title = `${recipe.title} | The Tasty Journal`;

  singleRecipeContainer.innerHTML = `
    <div class="recipe-header">
      <a href="/pages/recipes.html" class="back-link"><i class="fas fa-arrow-left"></i> Back to All Recipes</a>
      <h1>${recipe.title}</h1>
      <div class="recipe-meta">
        <span class="recipe-category"><i class="fas fa-utensils"></i> ${recipe.category}</span>
        <span class="recipe-date"><i class="far fa-calendar-alt"></i> ${recipe.date}</span>
        <span class="recipe-views"><i class="far fa-eye"></i> ${recipe.views} views</span>
      </div>
    </div>
    <div class="recipe-image">
      <img src="${recipe.image}" alt="${recipe.title}">
    </div>
    <div class="recipe-content">
      ${recipe.content}
    </div>
    <div class="recipe-tags">
      ${recipe.tags ? recipe.tags.map(tag => `<a href="/pages/recipes.html?search=${tag}" class="recipe-tag">#${tag}</a>`).join('') : ''}
    </div>
    <div class="recipe-share">
      <h3>Share this Recipe</h3>
      <div class="share-buttons">
        <a href="#" class="share-btn facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="share-btn twitter"><i class="fab fa-twitter"></i></a>
        <a href="#" class="share-btn pinterest"><i class="fab fa-pinterest-p"></i></a>
        <a href="#" class="share-btn email"><i class="far fa-envelope"></i></a>
      </div>
    </div>
    <div class="related-recipes">
      <h3>You Might Also Like</h3>
      <div class="article-grid" id="related-recipes-container"></div>
    </div>
  `;

  const relatedRecipesContainer = document.getElementById('related-recipes-container');
  if (relatedRecipesContainer) {
    const related = recipes.filter(r => r.category === recipe.category && r.id !== recipe.id).slice(0, 3);
    related.forEach(r => {
      const el = document.createElement('article');
      el.className = 'article-card';
      el.innerHTML = `
        <div class="article-img">
          <img src="${r.image}" alt="${r.title}">
        </div>
        <div class="article-content">
          <h3 class="article-title">${r.title}</h3>
          <a href="/pages/recipes.html?id=${r.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      `;
      relatedRecipesContainer.appendChild(el);
    });
  }

  window.scrollTo(0, 0);
}

// Handle URL parameters
function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const searchQuery = params.get('search');

  if (id) {
    displaySingleRecipe(id);
  } else if (searchQuery) {
    allRecipesSection.style.display = 'none';
    searchResultsSection.style.display = 'block';
    singleRecipeSection.style.display = 'none';
  } else {
    allRecipesSection.style.display = 'block';
    searchResultsSection.style.display = 'none';
    singleRecipeSection.style.display = 'none';
  }
}

function initPage() {
  loadRecipesFromCSV(() => {
    displayCategories();
    displayAllRecipes();
    handleUrlParams();
  });
}

window.addEventListener('DOMContentLoaded', initPage);

document.addEventListener('DOMContentLoaded', initPage);
