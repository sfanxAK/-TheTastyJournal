import { setupSearch } from '/js/search.js';
import { setupNewsletter } from '/js/newsletter.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');

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

// Add styles specific to the "New in Cooking" page
function addNewStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Page Banner */
    .page-banner {
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/5967859/pexels-photo-5967859.jpeg');
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
    
    /* Trends Section */
    .trends-section {
      margin-bottom: var(--space-xl);
    }
    
    .trends-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-lg);
      margin-top: var(--space-lg);
    }
    
    .trend-card {
      background-color: white;
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
    }
    
    .trend-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    .trend-img {
      height: 200px;
      overflow: hidden;
    }
    
    .trend-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-speed) ease;
    }
    
    .trend-card:hover .trend-img img {
      transform: scale(1.05);
    }
    
    .trend-content {
      padding: var(--space-md);
    }
    
    .trend-content h3 {
      margin-bottom: var(--space-xs);
      font-size: 1.3rem;
    }
    
    .trend-content p {
      color: var(--text-medium);
      margin-bottom: var(--space-sm);
      font-size: 0.95rem;
    }
    
    /* Featured Article */
    .featured-article {
      padding: var(--space-xl) 0;
      background-color: var(--background-gray);
      margin-bottom: var(--space-xl);
    }
    
    .featured-article-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
      align-items: center;
    }
    
    .featured-article-img {
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .featured-article-img img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.8s ease;
    }
    
    .featured-article-img:hover img {
      transform: scale(1.03);
    }
    
    .featured-article-text {
      padding: var(--space-md);
    }
    
    .featured-article-text h2 {
      margin-bottom: var(--space-xs);
    }
    
    .article-date {
      color: var(--text-light);
      font-style: italic;
      margin-bottom: var(--space-sm);
    }
    
    .featured-article-text p {
      margin-bottom: var(--space-md);
      line-height: 1.6;
    }
    
    /* Techniques Section */
    .techniques-section {
      margin-bottom: var(--space-xl);
    }
    
    .techniques-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }
    
    .technique-card {
      background-color: white;
      border-radius: var(--border-radius);
      padding: var(--space-md);
      text-align: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .technique-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    
    .technique-icon {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: var(--space-sm);
    }
    
    .technique-card h3 {
      margin-bottom: var(--space-xs);
      font-size: 1.2rem;
    }
    
    .technique-card p {
      color: var(--text-medium);
      font-size: 0.9rem;
    }
    
    /* Podcasts Section */
    .podcasts-section {
      margin-bottom: var(--space-xl);
    }
    
    .podcasts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }
    
    .podcast-card {
      background-color: white;
      border-radius: var(--border-radius);
      padding: var(--space-md);
      display: flex;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: transform var(--transition-speed) ease;
    }
    
    .podcast-card:hover {
      transform: translateY(-5px);
    }
    
    .podcast-logo {
      width: 60px;
      height: 60px;
      background-color: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--space-md);
      flex-shrink: 0;
    }
    
    .podcast-logo i {
      font-size: 1.5rem;
      color: white;
    }
    
    .podcast-content {
      flex-grow: 1;
    }
    
    .podcast-content h3 {
      margin-bottom: var(--space-xs);
      font-size: 1.2rem;
    }
    
    .podcast-content p {
      color: var(--text-medium);
      font-size: 0.9rem;
      margin-bottom: var(--space-xs);
    }
    
    .podcast-link {
      font-weight: 600;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
    }
    
    .podcast-link i {
      margin-right: 5px;
    }
    
    @media (max-width: 992px) {
      .featured-article-content {
        grid-template-columns: 1fr;
        gap: var(--space-md);
      }
      
      .featured-article-img {
        max-width: 600px;
        margin: 0 auto;
      }
      
      .techniques-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
    
    @media (max-width: 768px) {
      .trends-grid,
      .podcasts-grid {
        grid-template-columns: 1fr;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize the page
function initPage() {
  // Add page-specific styles
  addNewStyles();
  
  // Add animation effects
  const animateElements = () => {
    const elements = document.querySelectorAll('.trend-card, .featured-article-content, .technique-card, .podcast-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  };
  
  // Add animation styles
  const animationStyle = document.createElement('style');
  animationStyle.textContent = `
    .trend-card, .featured-article-content, .technique-card, .podcast-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .trend-card:nth-child(1) { transition-delay: 0.1s; }
    .trend-card:nth-child(2) { transition-delay: 0.2s; }
    .trend-card:nth-child(3) { transition-delay: 0.3s; }
    
    .technique-card:nth-child(1) { transition-delay: 0.1s; }
    .technique-card:nth-child(2) { transition-delay: 0.15s; }
    .technique-card:nth-child(3) { transition-delay: 0.2s; }
    .technique-card:nth-child(4) { transition-delay: 0.25s; }
    .technique-card:nth-child(5) { transition-delay: 0.3s; }
    .technique-card:nth-child(6) { transition-delay: 0.35s; }
    
    .podcast-card:nth-child(1) { transition-delay: 0.1s; }
    .podcast-card:nth-child(2) { transition-delay: 0.2s; }
    .podcast-card:nth-child(3) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(animationStyle);
  
  // Run animation after page loads
  window.addEventListener('load', animateElements);
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);