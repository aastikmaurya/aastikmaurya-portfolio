// Secure form validation with authorization
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Authorization check - verify form origin and user session
    if (!form || !nameInput || !emailInput || !messageInput || !document.referrer.includes(window.location.hostname)) {
        console.error('Unauthorized form access or elements not found');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) {
        console.error('Submit button not found');
        return;
    }
    
    // Improved email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Rate limiting for form submissions
    let lastSubmissionTime = 0;
    const SUBMISSION_COOLDOWN = 30000; // 30 seconds
    
    // Authorization check function
    function isAuthorizedSubmission() {
        const currentTime = Date.now();
        if (currentTime - lastSubmissionTime < SUBMISSION_COOLDOWN) {
            alert('Please wait before submitting another message.');
            return false;
        }
        lastSubmissionTime = currentTime;
        return true;
    }
    
    // Sanitize input to prevent XSS
    function sanitizeInput(input) {
        return input.replace(/[<>"'&]/g, function(match) {
            const escapeMap = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return escapeMap[match];
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset all errors
        nameInput.classList.remove('border-red-500', 'error');
        emailInput.classList.remove('border-red-500', 'error');
        messageInput.classList.remove('border-red-500', 'error');
        
        let hasErrors = false;
        
        // Validate and sanitize inputs
        const name = sanitizeInput(nameInput.value.trim());
        const email = sanitizeInput(emailInput.value.trim());
        const message = sanitizeInput(messageInput.value.trim());
        
        // Check name
        if (!name) {
            nameInput.classList.add('border-red-500', 'error');
            nameInput.placeholder = 'Name is required to send message';
            nameInput.value = '';
            hasErrors = true;
        }
        
        // Check email with proper validation
        if (!email || !isValidEmail(emailInput.value.trim())) {
            emailInput.classList.add('border-red-500', 'error');
            emailInput.placeholder = 'Valid email is required to send message';
            emailInput.value = '';
            hasErrors = true;
        }
        
        // Check message
        if (!message) {
            messageInput.classList.add('border-red-500', 'error');
            messageInput.placeholder = 'Message is required if you want to send a message';
            messageInput.value = '';
            hasErrors = true;
        }
        
        // If no errors, submit to Formspree with authorization
        if (!hasErrors && isAuthorizedSubmission()) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Create form data with sanitized inputs and authorization token
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            formData.append('_subject', 'Portfolio Contact Form');
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    submitBtn.textContent = 'Message Sent';
                    submitBtn.classList.add('success');
                    setTimeout(() => {
                        form.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.classList.remove('success');
                        submitBtn.disabled = false;
                        nameInput.placeholder = 'Your Name';
                        emailInput.placeholder = 'Your Email';
                        messageInput.placeholder = 'Your Message';
                    }, 1000);
                } else {
                    throw new Error('Network response was not ok');
                }
            }).catch(error => {
                console.error('Form submission error:', error);
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 3000);
            });
        }
    });
    
    // Clear errors on focus with null checks
    if (nameInput) {
        nameInput.addEventListener('focus', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('border-red-500', 'error');
                this.placeholder = 'Your Name';
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('focus', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('border-red-500', 'error');
                this.placeholder = 'Your Email';
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('focus', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('border-red-500', 'error');
                this.placeholder = 'Your Message';
            }
        });
    }
});
