import { recipes, loadRecipesFromCSV, categories, loadCategoriesFromCSV } from './data.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const tabsContainer = document.querySelector('.category-tabs');


document.addEventListener('DOMContentLoaded', async () => {
  loadCategoriesFromCSV(() => {
    renderCategoryTabsWithMore(categories);
  });
  addRecipeStyles();

  await loadRecipesFromCSV();
  filterRecipes('all');
  renderNewRecipes();

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
    const btnWidth = buttons[i].offsetWidth + 10;
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

    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the global click listener
      dropdown.classList.toggle('show');
      moreBtn.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const isClickInside = wrapper.contains(e.target);
      if (!isClickInside) {
        dropdown.classList.remove('show');
        moreBtn.classList.remove('active');
      }
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


function renderRecipeCards(filteredRecipes) {
  const recipeGrid = document.getElementById('recipe-grid');

  recipeGrid.innerHTML = '';

  filteredRecipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `

    <div class="recipe-img">
    <img src="${recipe.image}" alt="${recipe.title}">
    </div>
    <div class="recipe-content">
      <div class="recipe-meta">
        <span class="recipe-category">${recipe.category}</span>
        <span class="stars">★★★★★</span>
      </div>
      <h3 class="recipe-title">${recipe.title}</h3>
      <p class="recipe-excerpt">${recipe.excerpt}</p>
      <div class="recipe-meta2">
        <span><i class="far fa-clock"></i> ${recipe.totalTime || '30 mins'}</span>
        <span><i class="difficulty-level"></i>${recipe.difficulty}</span>
      </div>
      <a href="/recipe-post.html?id=${recipe.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
    </div>
    `;

    recipeGrid.appendChild(card);
  });
}

function filterRecipes(category) {
  const normalize = str => str.toLowerCase().replace(/\s+/g, '-');
  const filtered =
    category === 'all'
      ? recipes
      : recipes.filter(r => normalize(r.category) === normalize(category));


  renderRecipeCards(filtered);
}

// CSS styles for dropdown (append to your global style file or <style> block)
const dropdownStyle = document.createElement('style');
dropdownStyle.textContent = `
.tab-dropdown .dropdown-menu {
  display: none;
  position: absolute;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 8px;
  margin: 0;
  z-index: 10;
  grid-template-columns: repeat(2, max-content);
  gap: 4px 24px;
  max-height: 300px;
  overflow-y: auto;
}

.tab-dropdown .dropdown-menu li {
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
}
.tab-dropdown .dropdown-menu li:hover {
  background: #f7f7f7;
  }

.tab-dropdown .dropdown-menu li:active {
  border-bottom: 2px solid var(--primary-light);
  color: var(--primary-color);
}

.tab-dropdown .dropdown-menu.show {
  display: grid;
}

`;
document.head.appendChild(dropdownStyle);

// Display New recipes
function renderNewRecipes() {
  const NewRecipesContainer = document.getElementById('new-recipes-container');
  if (!NewRecipesContainer) return;

  const sortedRecipes = recipes
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  sortedRecipes.forEach(recipe => {
    const recipeElement = document.createElement('div');
    recipeElement.className = 'new-recipe-card';
    recipeElement.innerHTML = `
      <div class="new-recipe-card-img">
        <img src="${recipe.image}" alt="${recipe.title}">
      </div>
      <div class="new-recipe-card-content">
        <h4>${recipe.title}</h4>
        <span class="new-recipe-date">${recipe.date}</span>
        <p class="new-recipe-excerpt">${recipe.excerpt}</p>
        <a href="/recipe-post.html?id=${recipe.id}" class="read-more2">Read More <i class="fas fa-arrow-right"></i></a>
      </div>
    `;
    recipeElement.addEventListener('click', () => {
      window.location.href = `/pages/recipe-post.html?id=${recipe.id}`;
    });
    NewRecipesContainer.appendChild(recipeElement);
  });
}


// Add styles specific to recipes page
function addRecipeStyles() {
  const recipePageStyle = document.createElement('style');
  recipePageStyle.textContent = `
  /* Recipe Categories and Banner styles */

  .page-banner {
    background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cdn.jsdelivr.net/gh/sfanxak/-TheTastyJournal/media/TTJ-img21.webp');
    background-size: cover;
    background-position: center;
    color: white;
    text-align: center;
    padding: 100px 0 40px;
    margin-bottom: var(--space-sm);
  }
  
  .page-banner h1 {
    color: white;
    margin-bottom: var(--space-xs);
  }
   `;
  document.head.appendChild(recipePageStyle);
}

// Add CSS for animations that were referenced in the JS
const animationStyle = document.createElement('style');
animationStyle.textContent = `
  /* Animation and header behavior */

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
document.head.appendChild(animationStyle);




