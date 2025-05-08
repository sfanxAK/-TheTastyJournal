import { setupSearch } from './search.js';
import { setupNewsletter } from './newsletter.js';
import { db, collection, getDocs } from './firebase-config.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const categoriesGrid = document.getElementById('categories-grid');

// Loading state
const loadingSpinner = document.createElement('div');
loadingSpinner.className = 'loading-spinner';
loadingSpinner.innerHTML = '<div class="spinner"></div>';

// Mobile Navigation Toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
    
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

// Fetch and display categories
async function displayCategories() {
  if (!categoriesGrid) return;
  
  categoriesGrid.appendChild(loadingSpinner);
  
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    categoriesGrid.innerHTML = '';
    
    categoriesSnapshot.forEach(doc => {
      const category = doc.data();
      const categoryElement = document.createElement('div');
      categoryElement.className = 'category-card';
      
      categoryElement.innerHTML = `
        <div class="category-img">
          <img src="${category.image}" alt="${category.name}" loading="lazy">
        </div>
        <div class="category-content">
          <h2>${category.name}</h2>
          <p>${category.description}</p>
          <a href="/pages/recipes.html?category=${encodeURIComponent(category.name.toLowerCase())}" class="btn btn-primary">View Recipes</a>
        </div>
      `;
      
      categoriesGrid.appendChild(categoryElement);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    categoriesGrid.innerHTML = `
      <div class="error-message">
        <p>Failed to load categories. Please try again later.</p>
      </div>
    `;
  }
}

// Add loading spinner styles
const style = document.createElement('style');
style.textContent = `
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--background-gray);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    text-align: center;
    padding: var(--space-xl);
    color: var(--error-color);
  }
`;
document.head.appendChild(style);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  displayCategories();
});