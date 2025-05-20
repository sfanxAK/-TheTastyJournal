import { recipes, loadRecipesFromCSV } from './data.js';
import { setupSearch } from './search.js';

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

// Main loader function
async function init() {
  await loadRecipesFromCSV();

  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  const recipe = recipes.find(r => String(r.id) === recipeId);

  // 👇 Add this
  window.debugRecipes = recipes;
  window.debugRecipeId = recipeId;
  console.log("Parsed recipes:", recipes);
  console.log("Recipe ID from URL:", recipeId);

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
  document.getElementById('prep-time').textContent = recipe.prepTime;
  document.getElementById('cook-time').textContent = recipe.cookTime;
  document.getElementById('total-time').textContent = recipe.totalTime;
  document.getElementById('servings').textContent = recipe.servings;
  document.getElementById('difficulty').textContent = recipe.difficulty;

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

  // Create a function to generate share buttons
  function createShareButtons() {
    // Define the share buttons container
    const shareButtonsContainer = document.createElement('div');
    shareButtonsContainer.className = 'share-button-container';
    // Define the share buttons
    const shareButtons = [
      {
        className: 'facebook',
        icon: 'fab fa-facebook-f',
        shareUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
      },
      {
        className: 'twitter',
        icon: 'fab fa-twitter',
        shareUrl: 'https://twitter.com/intent/tweet?url=',
      },
      {
        className: 'pinterest',
        icon: 'fab fa-pinterest-p',
        shareUrl: 'https://pinterest.com/pin/create/button/?url=',
      },
      {
        className: 'email',
        icon: 'fas fa-envelope',
        shareUrl: 'mailto:?subject=Recipe&body=',
      },
    ];
    // Generate the share buttons HTML
    const shareButtonsHtml = shareButtons.map((button) => {
      return `
        <button class="share-btn ${button.className}" data-share-url="${button.shareUrl}">
          <i class="${button.icon}"></i>
        </button>
      `;
    }).join('');
    // Set the share buttons container HTML
    shareButtonsContainer.innerHTML = shareButtonsHtml;
    // Append the share buttons container to the target element
    const targetElement = document.getElementById('share-buttons');
    targetElement.appendChild(shareButtonsContainer);
    // Add event listeners to the share buttons
    const shareButtonsElements = shareButtonsContainer.querySelectorAll('.share-btn');
    shareButtonsElements.forEach((button) => {
    button.addEventListener('click', (event) => {
      const shareUrl = button.getAttribute('data-share-url');
      const currentPageUrl = window.location.href;
      const shareLink = `${shareUrl}${currentPageUrl}`;
      // Open the share link in a new window
      window.open(shareLink, '_blank', 'noopener noreferrer');
    });
    });
    }
    // Call the function to create the share buttons
    createShareButtons();


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
const newPosts = recipes.filter(r => r.id !== recipe.id).slice(0, 4);
newPosts.forEach(post => {
  const postItem = document.createElement('div');
  postItem.className = 'new-recipe-card';
  postItem.innerHTML = `
    <img src="${post.image}" alt="${post.title}" loading="lazy">
    <div class="new-recipe-content">
      <h4>${post.title}</h4>
      <span class="post-recipe-date">${post.date}</span>
    </div>
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

// Add styles specific to recipes page
function addRecipeStyles() {
  const style = document.createElement('style');
  style.textContent = `
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
      font-size: 1rem;
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


document.addEventListener('DOMContentLoaded', init);
