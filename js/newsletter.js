export function setupNewsletter() {
  const newsletterForm = document.getElementById('newsletter-form');
  const subscriptionMessage = document.getElementById('subscription-message');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      
      // Normally, this would submit to Formspree
      // But for demo purposes, we'll simulate a successful subscription
      
      // Show loading state
      if (subscriptionMessage) {
        subscriptionMessage.innerHTML = `<div class="loading">Submitting...</div>`;
        subscriptionMessage.style.display = 'block';
      }
      
      // Simulate API call
      setTimeout(() => {
        // Show success message
        if (subscriptionMessage) {
          subscriptionMessage.innerHTML = `
            <div class="success">
              <i class="fas fa-check-circle"></i>
              Thank you for subscribing! You'll receive our next newsletter soon.
            </div>
          `;
        }
        
        // Reset form
        newsletterForm.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
          if (subscriptionMessage) {
            subscriptionMessage.style.display = 'none';
          }
        }, 5000);
      }, 1500);
      
      // In a real implementation, you would submit the form to Formspree
      // The form's action attribute already has the Formspree endpoint
      // const formData = new FormData(newsletterForm);
      // fetch(newsletterForm.action, {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Accept': 'application/json'
      //   }
      // })
      // .then(response => response.json())
      // .then(data => {
      //   // Handle success
      //   subscriptionMessage.innerHTML = `
      //     <div class="success">
      //       <i class="fas fa-check-circle"></i>
      //       Thank you for subscribing! You'll receive our next newsletter soon.
      //     </div>
      //   `;
      //   newsletterForm.reset();
      // })
      // .catch(error => {
      //   // Handle error
      //   subscriptionMessage.innerHTML = `
      //     <div class="error">
      //       <i class="fas fa-exclamation-circle"></i>
      //       There was a problem submitting your subscription. Please try again.
      //     </div>
      //   `;
      // });
    });
  }
  
  // Add CSS for newsletter messages
  const style = document.createElement('style');
  style.textContent = `
    #subscription-message {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: var(--border-radius);
      font-weight: 600;
      display: none;
    }
    
    #subscription-message .loading {
      color: var(--text-medium);
    }
    
    #subscription-message .success {
      color: var(--success-color);
      display: flex;
      align-items: center;
    }
    
    #subscription-message .error {
      color: var(--error-color);
      display: flex;
      align-items: center;
    }
    
    #subscription-message i {
      margin-right: 0.5rem;
    }
  `;
  document.head.appendChild(style);
}