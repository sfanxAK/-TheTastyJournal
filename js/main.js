import { recipes } from './data.js';
import { setupSearch } from './search.js';
import { setupNewsletter } from './newsletter.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const latestArticlesContainer = document.getElementById('latest-articles-container');
const mostViewedContainer = document.getElementById('most-viewed-container');

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

// Render recipes on the page
function renderRecipes(container, recipesList) {
  if (!container) return;
  
  container.innerHTML = '';
  
  recipesList.forEach(recipe => {
    const articleElement = document.createElement('article');
    articleElement.className = 'article-card';
    
    articleElement.innerHTML = `
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
    
    container.appendChild(articleElement);
  });
}

// Display latest articles (sorted by date)
function displayLatestArticles() {
  if (!latestArticlesContainer) return;
  
  const sortedByDate = [...recipes].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  }).slice(0, 3);
  
  renderRecipes(latestArticlesContainer, sortedByDate);
}

// Display most viewed articles
function displayMostViewedArticles() {
  if (!mostViewedContainer) return;
  
  const sortedByViews = [...recipes].sort((a, b) => {
    return b.views - a.views;
  }).slice(0, 3);
  
  renderRecipes(mostViewedContainer, sortedByViews);
}

// Initialize the page
function initPage() {
  displayLatestArticles();
  displayMostViewedArticles();
  
  // Add animation classes to elements as they enter the viewport
  const animatedElements = document.querySelectorAll('.section-title, .article-card, .newsletter-content');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
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