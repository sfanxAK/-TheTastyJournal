import { recipes, loadRecipesFromCSV, categories, loadCategoriesFromCSV } from './data.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const allRecipesContainer = document.getElementById('all-recipes-container');
const tabsContainer = document.querySelector('.category-tabs');
const recipeGrid = document.getElementById('recipe-grid');


// Load evrything 
document.addEventListener('DOMContentLoaded', () => {
  
  loadCategoriesFromCSV(() => {
    renderCategoryTabsWithMore(categories);
  });

  loadRecipesFromCSV().then(() => {
    filterRecipes('all');
  });
});
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
// This function renders category tabs and pushes overflow tabs into a "More" dropdown.
function renderCategoryTabsWithMore(categories) {
  tabsContainer.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'tab active';
  allBtn.dataset.category = 'all';
  allBtn.textContent = 'All';
  tabsContainer.appendChild(allBtn);

  const buttons = [];

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.category = cat.name;
    btn.textContent = cat.name;
    buttons.push(btn);
  });

  // Temporarily add all to measure widths
  buttons.forEach(btn => tabsContainer.appendChild(btn));

  const availableWidth = tabsContainer.offsetWidth;
  let currentWidth = allBtn.offsetWidth + 20; // Include gap
  let maxVisibleIndex = 0;

  const maxTabs = window.innerWidth > 768 ? 12 : categories.length;

  for (let i = 0; i < buttons.length && maxVisibleIndex < maxTabs; i++) {
    const btnWidth = buttons[i].offsetWidth + 20;
    if ((currentWidth + btnWidth) < availableWidth) {
      currentWidth += btnWidth;
      maxVisibleIndex = i + 1;
    } else {
      break;
    }
  }

  // Remove all and re-add based on visible count
  tabsContainer.innerHTML = '';
  tabsContainer.appendChild(allBtn);

  const visible = buttons.slice(0, maxVisibleIndex);
  const overflow = buttons.slice(maxVisibleIndex);

  visible.forEach(btn => tabsContainer.appendChild(btn));

  if (overflow.length > 0) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tab tab-dropdown';

    const moreBtn = document.createElement('button');
    moreBtn.className = 'tab';
    moreBtn.innerHTML = 'More <span class="arrow">&#9662;</span>';

    const dropdown = document.createElement('ul');
    dropdown.className = 'dropdown-menu';

    overflow.forEach(btn => {
      const li = document.createElement('li');
      li.textContent = btn.textContent;
      li.addEventListener('click', () => {
        setActiveCategory(btn.dataset.category);
        filterRecipes(btn.dataset.category);
        dropdown.classList.remove('show');
      });
      dropdown.appendChild(li);
    });

    wrapper.appendChild(moreBtn);
    wrapper.appendChild(dropdown);
    tabsContainer.appendChild(wrapper);

    moreBtn.addEventListener('click', () => dropdown.classList.toggle('show'));
    document.addEventListener('click', e => {
      if (!wrapper.contains(e.target)) dropdown.classList.remove('show');
    });
  }

  // Add event listeners
  const allTabs = document.querySelectorAll('.category-tabs .tab');
  allTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;
      if (cat) {
        setActiveCategory(cat);
        filterRecipes(cat);
      }
    });
  });
}

// Auto re-render on window resize
window.addEventListener('resize', () => {
  renderCategoryTabsWithMore(categories);
});


function setActiveCategory(name) {
  document.querySelectorAll('.category-tabs .tab').forEach(tab => {
    if (tab.dataset.category === name) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

// Example card creation inside your recipe rendering logic:
function renderRecipes(recipes) {
  recipeContainer.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>${recipe.excerpt}</p>
    `;

    // Make sure each card links to the correct recipe-post.html with ID as a parameter
    card.addEventListener('click', () => {
      window.location.href = `recipe-post.html?id=${recipe.id}`;
    });

    recipeContainer.appendChild(card);
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

    card.addEventListener('click', () => {
      window.location.href = `recipe-post.html?id=${recipe.id}`;
    });


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

// CSS styles for dropdown (append to your global style file or <style> block)
const dropdownStyle = document.createElement('style');
dropdownStyle.textContent = `
  .tab-dropdown {
    position: relative;
  }
  .tab-dropdown .dropdown-menu {
    display: none;
    position: absolute;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 10;
  }
  .tab-dropdown .dropdown-menu li {
    padding: 8px 16px;
    cursor: pointer;
  }
  .tab-dropdown .dropdown-menu li:hover {
    background-color: #f0f0f0;
  }
  .tab-dropdown .dropdown-menu.show {
    display: block;
  }
`;
document.head.appendChild(dropdownStyle);


// Load everything
document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesFromCSV(() => {
    renderCategoryTabs();
    renderCategoryNavMenu();
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