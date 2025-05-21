import { recipes, loadRecipesFromCSV, categories, loadCategoriesFromCSV } from './data.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const allRecipesContainer = document.getElementById('all-recipes-container');
const tabsContainer = document.querySelector('.category-tabs');
const recipeGrid = document.getElementById('recipe-grid');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadRecipesFromCSV();
    displayAllRecipes();
    
    addRecipeStyles();
  } catch (error) {
    console.error('Error loading data:', error);
  }
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



// Display by categories

function renderCategoryTabs() {
  tabsContainer.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'tab active';
  allBtn.dataset.category = 'all';
  allBtn.textContent = 'All';
  tabsContainer.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.category = cat.name;
    btn.textContent = cat.name;
    tabsContainer.appendChild(btn);
  });

  // Add click listeners after rendering
  const categoryTabs = document.querySelectorAll('.category-tabs .tab');
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterRecipes(tab.dataset.category);
    });
  });
}

function renderRecipeCards(filteredRecipes) {
  recipeGrid.innerHTML = '';

  filteredRecipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
      <div class="recipe-meta">
        <span class="category">${recipe.category.toUpperCase()}</span>
        <h3>${recipe.title}</h3>
        <div class="info">
          <span><i class="far fa-clock"></i> ${recipe.totalTime || '30 mins'}</span>
          <span class="stars">★★★★★</span>
        </div>
      </div>
    `;
    recipeGrid.appendChild(card);
  });
}

function filterRecipes(category) {
  const filtered =
    category === 'all'
      ? recipes
      : recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());

  renderRecipeCards(filtered);
}

// Load everything
document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesFromCSV(() => {
    renderCategoryTabs();
  });

  loadRecipesFromCSV().then(() => {
    filterRecipes('all');
  });
});






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
        <a href="/recipe-post.html?id=${recipe.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
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
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cdn.jsdelivr.net/gh/sfanxak/-TheTastyJournal/media/TTJ-img21.webp');
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
    
  `;
  document.head.appendChild(style);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesFromCSV(() => {
    displayCategories(); 
  });

  loadRecipesFromCSV(() => {
    displayAllRecipes();
  });

  addRecipeStyles();
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