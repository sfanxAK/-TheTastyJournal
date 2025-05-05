import { recipes } from './data.js';
import { setupSearch } from './search.js';

// Get recipe ID from URL parameters
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const urlParams = new URLSearchParams(window.location.search);
const recipeId = parseInt(urlParams.get('id'));

// Find the current recipe
const recipe = recipes.find(r => r.id === recipeId);

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


// Initialize search functionality
setupSearch();

if (!recipe) {
  window.location.href = '/pages/recipes.html';
}

// Update page title
document.title = `${recipe.title} | Culinary Canvas`;

// Populate recipe content
document.getElementById('recipe-title').textContent = recipe.title;
document.getElementById('recipe-category').textContent = recipe.category;
document.getElementById('recipe-date').textContent = recipe.date;

// Set featured image with WebP support
const recipeImage = document.getElementById('recipe-image');
recipeImage.innerHTML = `
  <source srcset="${recipe.image.replace(/\.(jpg|jpeg|png)$/, '.webp')}" type="image/webp">
  <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
`;

// Set recipe intro
document.getElementById('recipe-intro').innerHTML = recipe.excerpt;

// Set quick info
document.getElementById('prep-time').textContent = recipe.prepTime || '30 mins';
document.getElementById('cook-time').textContent = recipe.cookTime || '45 mins';
document.getElementById('total-time').textContent = recipe.totalTime || '1 hr 15 mins';
document.getElementById('servings').textContent = recipe.servings || '4 servings';
document.getElementById('difficulty').textContent = recipe.difficulty || 'Medium';

// Parse and set ingredients
const ingredientsList = document.getElementById('ingredients-list');
const ingredients = recipe.content.match(/<h3>Ingredients<\/h3>\s*<ul>(.*?)<\/ul>/s);
if (ingredients && ingredients[1]) {
  ingredientsList.innerHTML = ingredients[1];
}

// Parse and set instructions
const instructionsList = document.getElementById('instructions-list');
const instructions = recipe.content.match(/<h3>Instructions<\/h3>\s*<ol>(.*?)<\/ol>/s);
if (instructions && instructions[1]) {
  instructionsList.innerHTML = instructions[1];
}

// Set recipe notes
const notesContent = document.getElementById('recipe-notes');
const notes = recipe.content.match(/<p>((?!<h3>).*?)<\/p>$/s);
if (notes && notes[1]) {
  notesContent.innerHTML = notes[1];
}

// Load related recipes
const relatedRecipesGrid = document.getElementById('related-recipes-grid');
const relatedRecipes = recipes
  .filter(r => r.category === recipe.category && r.id !== recipe.id)
  .slice(0, 3);

relatedRecipes.forEach(relatedRecipe => {
  const recipeCard = document.createElement('article');
  recipeCard.className = 'recipe-card';
  
  recipeCard.innerHTML = `
    <img src="${relatedRecipe.image}" alt="${relatedRecipe.title}" loading="lazy">
    <div class="recipe-card-content">
      <h3>${relatedRecipe.title}</h3>
      <p>${relatedRecipe.excerpt.slice(0, 100)}...</p>
    </div>
  `;
  
  recipeCard.addEventListener('click', () => {
    window.location.href = `/pages/recipe-post.html?id=${relatedRecipe.id}`;
  });
  
  relatedRecipesGrid.appendChild(recipeCard);
});

// Lazy load images
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
    
    images.forEach(img => {
      img.classList.add('lazyload');
    });
  }
});

// Add CSS for animations that were referenced in the JS
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