import { recipes, loadRecipesFromCSV, categories, loadCategoriesFromCSV } from './data.js';

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

document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesFromCSV(() => {
    displayCategories(); // now this will work
  });

  loadRecipesFromCSV(() => {
    displayAllRecipes(); // this already works
    handleUrlParams();   // needed if viewing a single recipe
  });

  addRecipeStyles();
});

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


// Display categories
function displayCategories() {
  if (!categoriesContainer) return;
  
  categoriesContainer.innerHTML = '';
  
  categories.forEach(category => {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-item';
    
    categoryElement.innerHTML = `
      <div class="category-img">
        <img src="${category.image}" alt="${category.name}">
      </div>
      <h3>${category.name}</h3>
      <a href="../pages/categories.html?category=${encodeURIComponent(category.name.toLowerCase())}" class="category-link">View Recipes</a>
      `;
    
    categoriesContainer.appendChild(categoryElement);
  });
}

// Display all recipes
function displayAllRecipes() {
  if (!allRecipesContainer) return;
  
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
        <a href="/pages/recipe-post.html?id=${recipe.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
      </div>
    `;
    
    allRecipesContainer.appendChild(recipeElement);
  });
}

// Add styles specific to recipes page
function addRecipeStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Page Banner */
    .page-banner {
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cdn.jsdelivr.net/gh/sfanxak/-TheTastyJournal@c9951464d9f2dddb1302acbda42fca2b7da21482/media/TTJ-img21.webp');
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
    
    /* Recipe Categories */
    .categories-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }
    
    .category-item {
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: transform var(--transition-speed) ease;
      text-align: center;
      background-color: white;
    }
    
    .category-item:hover {
      transform: translateY(-5px);
    }
    
    .category-img {
      height: 150px;
      overflow: hidden;
    }
    
    .category-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-speed) ease;
    }
    
    .category-item:hover .category-img img {
      transform: scale(1.05);
    }
    
    .category-item h3 {
      padding: var(--space-sm) var(--space-sm) var(--space-xs);
      font-size: 1.2rem;
    }
    
    .category-link {
      display: inline-block;
      padding: 0 var(--space-sm) var(--space-sm);
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    /* Single Recipe Styles */
    .recipe-header {
      margin-bottom: var(--space-md);
    }
    
    .back-link {
      display: inline-block;
      margin-bottom: var(--space-sm);
      font-weight: 600;
    }
    
    .back-link i {
      margin-right: 5px;
    }
    
    .recipe-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
      color: var(--text-medium);
      font-size: 0.9rem;
    }
    
    .recipe-meta span {
      display: flex;
      align-items: center;
    }
    
    .recipe-meta i {
      margin-right: 5px;
      color: var(--primary-color);
    }
    
    .recipe-image {
      width: 100%;
      max-height: 500px;
      overflow: hidden;
      border-radius: var(--border-radius);
      margin-bottom: var(--space-lg);
    }
    
    .recipe-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .recipe-content {
      margin-bottom: var(--space-lg);
      line-height: 1.6;
    }
    
    .recipe-content h3 {
      margin-top: var(--space-lg);
      margin-bottom: var(--space-sm);
      color: var(--secondary-color);
    }
    
    .recipe-content h4 {
      margin-top: var(--space-md);
      margin-bottom: var(--space-xs);
      color: var(--secondary-color);
    }
    
    .recipe-content ul, .recipe-content ol {
      margin-bottom: var(--space-md);
      padding-left: var(--space-lg);
    }
    
    .recipe-content ul li, .recipe-content ol li {
      margin-bottom: var(--space-xs);
    }
    
    .recipe-content ul {
      list-style-type: disc;
    }
    
    .recipe-content ol {
      list-style-type: decimal;
    }
    
    .recipe-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: var(--space-lg);
    }
    
    .recipe-tag {
      display: inline-block;
      padding: 5px 10px;
      background-color: var(--background-gray);
      border-radius: 20px;
      font-size: 0.8rem;
      color: var(--text-medium);
      transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
    }
    
    .recipe-tag:hover {
      background-color: var(--primary-light);
      color: white;
    }
    
    .recipe-share {
      border-top: 1px solid var(--border-color);
      padding-top: var(--space-md);
      margin-bottom: var(--space-lg);
    }
    
    .recipe-share h3 {
      margin-bottom: var(--space-sm);
    }
    
    .share-buttons {
      display: flex;
      gap: var(--space-xs);
    }
    
    .share-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: white;
      transition: transform var(--transition-speed) ease;
    }
    
    .share-btn:hover {
      transform: translateY(-3px);
    }
    
    .share-btn.facebook {
      background-color: #3b5998;
    }
    
    .share-btn.twitter {
      background-color: #1da1f2;
    }
    
    .share-btn.pinterest {
      background-color: #bd081c;
    }
    
    .share-btn.email {
      background-color: #777;
    }
    
    .related-recipes {
      border-top: 1px solid var(--border-color);
      padding-top: var(--space-md);
    }
    
    .related-recipes h3 {
      margin-bottom: var(--space-md);
    }
    
    .no-results {
      text-align: center;
      padding: var(--space-xl) 0;
    }
    
    .no-results p {
      font-size: 1.2rem;
      margin-bottom: var(--space-md);
      color: var(--text-medium);
    }
    
    @media (max-width: 768px) {
      .recipe-meta {
        flex-direction: column;
        gap: var(--space-xs);
      }
      
      .share-buttons {
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize the page
function initPage() {
  // Add recipe-specific styles
  addRecipeStyles();
  
  // Display categories and recipes
  displayCategories();
  displayAllRecipes();
  
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

