import { recipes, categories, loadRecipesFromCSV } from './data.js';
import { setupSearch } from './search.js';
import { setupFilters } from './filters.js';

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

// Mobile Navigation Toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
    // Animate hamburger icon
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
    
    // Reset hamburger icon
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


// CSS Animations
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    animation: fadeIn 0.8s ease forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hamburger span.active:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  .hamburger span.active:nth-child(2) {
    opacity: 0;
  }
  .hamburger span.active:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
  .no-scroll {
    overflow: hidden;
  }
  header.scrolled {
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(style);

// Initialize Search & Filters
setupSearch();
setupFilters();

// Main loader function
async function init() {
  await loadRecipesFromCSV();

  const recipeId = getQueryParam("id");

  console.log("Parsed recipes:", recipes);
  console.log("Recipe ID from URL:", recipeId);
  const recipe = recipes.find(r => String(r.id) === recipeId);

  if (!recipe) {
    window.location.href = '/pages/recipes.html';
    return;
  }

  // Update page title
  document.title = `${recipe.title} | Culinary Canvas`;

  // Populate content
  document.getElementById('recipe-title').textContent = recipe.title;
  document.getElementById('recipe-category').textContent = recipe.category;
  document.getElementById('recipe-date').textContent = recipe.date;

  // Set image with WebP fallback
  document.getElementById('recipe-image').innerHTML = `
    <source srcset="${recipe.image.replace(/\.(jpg|jpeg|png)$/, '.webp')}" type="image/webp">
    <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
  `;

  document.getElementById('recipe-intro').innerHTML = recipe.excerpt;
  document.getElementById('prep-time').textContent = recipe.prepTime || '30 mins';
  document.getElementById('cook-time').textContent = recipe.cookTime || '45 mins';
  document.getElementById('total-time').textContent = recipe.totalTime || '1 hr 15 mins';
  document.getElementById('servings').textContent = recipe.servings || '4 servings';
  document.getElementById('difficulty').textContent = recipe.difficulty || 'Medium';

  // Ingredients
  const ingredients = recipe.content.match(/<h3>Ingredients<\/h3>\s*<ul>(.*?)<\/ul>/s);
  if (ingredients && ingredients[1]) {
    document.getElementById('ingredients-list').innerHTML = ingredients[1];
  }

  // Instructions
  const instructions = recipe.content.match(/<h3>Instructions<\/h3>\s*<ol>(.*?)<\/ol>/s);
  if (instructions && instructions[1]) {
    document.getElementById('instructions-list').innerHTML = instructions[1];
  }

  // Notes
  const notes = recipe.content.match(/<p>((?!<h3>).*?)<\/p>$/s);
  if (notes && notes[1]) {
    document.getElementById('recipe-notes').innerHTML = notes[1];
  }

  // Load Related Recipes (by category)
  const relatedRecipesGrid = document.getElementById('related-recipes-grid');
  const relatedRecipes = recipes
    .filter(r => r.category === recipe.category && r.id !== recipe.id)
    .slice(0, 4);

  relatedRecipes.forEach(related => {
    const card = document.createElement('article');
    card.className = 'related-recipe-card';
    card.innerHTML = `
      <img src="${related.image}" alt="${related.title}" loading="lazy">
      <div class="related-recipe-content">
        <h4>${related.title}</h4>
        <span class="related-recipe-date">${related.date}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `/pages/recipe-post.html?id=${related.id}`;
    });
    relatedRecipesGrid.appendChild(card);
  });

  // New Recipes in Sidebar
  const newRecipesList = document.getElementById('new-recipes-list');
  const newPosts = recipes.filter(r => r.id !== recipe.id).slice(0, 5);
  newPosts.forEach(post => {
    const postItem = document.createElement('div');
    postItem.className = 'new-post-item';
    postItem.innerHTML = `
      <a href="/pages/recipe-post.html?id=${post.id}">
        <img src="${post.image}" alt="${post.title}" loading="lazy" style="width:100%; border-radius:4px;">
        <p style="margin-top:0.5rem;">${post.title}</p>
      </a>
    `;
    newRecipesList.appendChild(postItem);
  });

  // Lazy loading
  const images = document.querySelectorAll('img[loading="lazy"]');
  if (!('loading' in HTMLImageElement.prototype)) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
    images.forEach(img => img.classList.add('lazyload'));
  }
}

document.addEventListener('DOMContentLoaded', init);
