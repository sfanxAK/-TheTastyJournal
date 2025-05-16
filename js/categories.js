import { categories, loadCategoriesFromCSV } from './data.js';

// Show all categories on page
function displayAllCategories() {
  const categoriesGrid = document.getElementById('categories-grid');
  if (!categoriesGrid) return;

  categoriesGrid.innerHTML = '';

  categories.forEach(category => {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-card';

    categoryElement.innerHTML = `
      <div class="category-img">
        <img src="${category.image}" alt="${category.name}">
      </div>
      <div class="category-content">
        <h2>${category.name}</h2>
        <p>${category.description}</p>
        <a href="/pages/categories.html?category=${encodeURIComponent(category.name.toLowerCase())}" class="btn btn-primary">View Recipes</a>
      </div>
    `;

    categoriesGrid.appendChild(categoryElement);
  });
}

// Show recipes by category
function displayCategoryRecipes(categoryName) {
  const categoryHeader = document.getElementById('category-header');
  const categoryRecipesContainer = document.getElementById('category-recipes-container');

  const category = categories.find(
    c => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!category || !categoryHeader || !categoryRecipesContainer) return;

  categoryHeader.innerHTML = `
    <a href="/pages/categories.html" class="back-link"><i class="fas fa-arrow-left"></i> All Categories</a>
    <h1>${category.name}</h1>
    <p>${category.description}</p>
  `;

  const filteredRecipes = recipes.filter(
    r => r.category.toLowerCase() === categoryName.toLowerCase()
  );

  categoryRecipesContainer.innerHTML = '';

  if (filteredRecipes.length > 0) {
    filteredRecipes.forEach(recipe => {
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
      categoryRecipesContainer.appendChild(recipeElement);
    });
  } else {
    categoryRecipesContainer.innerHTML = `
      <div class="no-recipes">
        <p>No recipes found in this category.</p>
        <a href="/pages/recipes.html" class="btn btn-secondary">View All Recipes</a>
      </div>
    `;
  }
}

// Handle URL to show specific category
function handleUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');

  const allCategoriesSection = document.getElementById('all-categories-section');
  const categoryRecipesSection = document.getElementById('category-recipes-section');

  if (categoryParam) {
    if (allCategoriesSection) allCategoriesSection.style.display = 'none';
    if (categoryRecipesSection) categoryRecipesSection.style.display = 'block';
    displayCategoryRecipes(categoryParam);
  } else {
    if (allCategoriesSection) allCategoriesSection.style.display = 'block';
    if (categoryRecipesSection) categoryRecipesSection.style.display = 'none';
    displayAllCategories();
  }
}

// Run everything after DOM and CSV are ready
document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesFromCSV(() => {
    handleUrlParams();
  });
});

import { setupSearch } from './search.js';
import { setupNewsletter } from './newsletter.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const categoriesGrid = document.getElementById('categories-grid');
const allCategoriesSection = document.getElementById('all-categories-section');
const categoryRecipesSection = document.getElementById('category-recipes-section');
const categoryHeader = document.getElementById('category-header');
const categoryRecipesContainer = document.getElementById('category-recipes-container');

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

// Initialize search functionality
setupSearch();

// Initialize newsletter functionality
setupNewsletter();


// Add styles specific to categories page
function addCategoryStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Page Banner */
    .page-banner {
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cdn.jsdelivr.net/gh/sfanxak/-TheTastyJournal@c9951464d9f2dddb1302acbda42fca2b7da21482/media/TTJ-img19.webp');
      background-size: cover;
      background-position: center;
      color: white;
      text-align: center;
      padding: 100px 0 60px;
      margin-bottom: var(--space-lg);
    }
    
    .page-banner h1 {
      color: white;
      margin-bottom: var(--space-xs);
    }
    
    /* Categories Grid */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }
    
    .category-card {
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
      background-color: white;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }
    
    .category-img {
      height: 200px;
      overflow: hidden;
    }
    
    .category-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-speed) ease;
    }
    
    .category-card:hover .category-img img {
      transform: scale(1.05);
    }
    
    .category-content {
      padding: var(--space-md);
    }
    
    .category-content h2 {
      margin-bottom: var(--space-xs);
      font-size: 1.5rem;
    }
    
    .category-content p {
      color: var(--text-medium);
      margin-bottom: var(--space-md);
      font-size: 0.95rem;
    }
    
    /* Category Recipes Section */
    .category-header {
      margin-bottom: var(--space-lg);
    }
    
    .back-link {
      display: inline-block;
      margin-bottom: var(--space-sm);
      font-weight: 600;
    }
    
    .back-link i {
      margin-right: 5px;
    }
    
    .category-header h1 {
      margin-bottom: var(--space-xs);
    }
    
    .category-header p {
      color: var(--text-medium);
      max-width: 700px;
    }
    
    .no-recipes {
      text-align: center;
      padding: var(--space-xl) 0;
    }
    
    .no-recipes p {
      font-size: 1.2rem;
      margin-bottom: var(--space-md);
      color: var(--text-medium);
    }
    
    @media (max-width: 768px) {
      .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
    
    @media (max-width: 576px) {
      .categories-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize the page
function initPage() {
  // Add category-specific styles
  addCategoryStyles();
  
  // Display all categories
  displayAllCategories();
  
  // Handle URL parameters
  handleUrlParams();

}


// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);

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