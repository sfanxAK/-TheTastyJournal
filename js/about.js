import { setupSearch } from './search.js';
import { setupNewsletter } from './newsletter.js';

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

// Add styles specific to the about page
function addAboutStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Page Banner */
    .page-banner {
      background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/4252146/pexels-photo-4252146.jpeg');
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
    
    /* About Content */
    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
      align-items: center;
    }
    
    .about-image {
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .about-image img {
      width: 100%;
      height: auto;
      transition: transform 0.8s ease;
    }
    
    .about-image:hover img {
      transform: scale(1.03);
    }
    
    .about-text h2 {
      margin-bottom: var(--space-sm);
    }
    
    .about-text h3 {
      margin-top: var(--space-lg);
      margin-bottom: var(--space-sm);
    }
    
    .about-text p {
      margin-bottom: var(--space-md);
      line-height: 1.6;
    }
    
    /* Philosophy Section */
    .philosophy-section {
      margin-bottom: var(--space-xl);
    }
    
    .philosophy-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }
    
    .philosophy-card {
      background-color: white;
      border-radius: var(--border-radius);
      padding: var(--space-md);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
    }
    
    .philosophy-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    
    .philosophy-icon {
      font-size: 2rem;
      color: var(--primary-color);
      margin-bottom: var(--space-sm);
    }
    
    .philosophy-card h3 {
      margin-bottom: var(--space-xs);
      font-size: 1.25rem;
    }
    
    .philosophy-card p {
      color: var(--text-medium);
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    /* Contact Section */
    .contact-section {
      margin-bottom: var(--space-xl);
    }
    
    .contact-methods {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }
    
    .contact-method {
      background-color: white;
      border-radius: var(--border-radius);
      padding: var(--space-md);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform var(--transition-speed) ease;
    }
    
    .contact-method:hover {
      transform: translateY(-5px);
    }
    
    .contact-icon {
      font-size: 2rem;
      color: var(--primary-color);
      margin-bottom: var(--space-sm);
    }
    
    .contact-method h3 {
      margin-bottom: var(--space-xs);
      font-size: 1.25rem;
    }
    
    .contact-method p {
      color: var(--text-medium);
      font-size: 1rem;
    }
    
    .social-mini {
      display: flex;
      justify-content: center;
      gap: var(--space-xs);
      margin-top: var(--space-xs);
    }
    
    .social-mini a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 50%;
      color: var(--text-medium);
      transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
    }
    
    .social-mini a:hover {
      background-color: var(--primary-color);
      color: white;
    }
    
    @media (max-width: 992px) {
      .about-content {
        grid-template-columns: 1fr;
        gap: var(--space-md);
      }
      
      .about-image {
        order: -1;
        max-width: 600px;
        margin: 0 auto;
      }
    }
    
    @media (max-width: 768px) {
      .philosophy-cards,
      .contact-methods {
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
  // Add about-specific styles
  addAboutStyles();
  
  // Add animation effects
  const animateElements = () => {
    const elements = document.querySelectorAll('.about-content, .philosophy-card, .contact-method');
    
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
    .about-content, .philosophy-card, .contact-method {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in {
      opacity: 1;
      transform: translateY(0);
    }
    
    .philosophy-card:nth-child(1) { transition-delay: 0.1s; }
    .philosophy-card:nth-child(2) { transition-delay: 0.2s; }
    .philosophy-card:nth-child(3) { transition-delay: 0.3s; }
    .philosophy-card:nth-child(4) { transition-delay: 0.4s; }
    
    .contact-method:nth-child(1) { transition-delay: 0.1s; }
    .contact-method:nth-child(2) { transition-delay: 0.2s; }
    .contact-method:nth-child(3) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(animationStyle);
  
  // Run animation after page loads
  window.addEventListener('load', animateElements);
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);