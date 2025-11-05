// Initialize app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements with null checks
    const fireflyContainer = document.getElementById('firefly-container');
    const body = document.body;
    const navbarLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('.fade-in');
    const progressFills = document.querySelectorAll('.progress-fill');

    const cvDownloadLink = document.getElementById('cv-download');
    const allCards = document.querySelectorAll('.card');
    const allSocialIcons = document.querySelectorAll('.social-icon');
    const downloadButton = document.querySelector('.download-btn');
    
    // Check if required elements exist
    if (!fireflyContainer) {
        console.error('Firefly container not found');
        return;
    }
    


    // Create single firefly with variable speed and fade effects
    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        
        // Random position
        const randomX = (Math.random() - 0.5) * 200;
        const randomY = (Math.random() - 0.5) * 200;
        firefly.style.setProperty('--rand-x', randomX);
        firefly.style.setProperty('--rand-y', randomY);
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.left = `${Math.random() * 100}%`;
        
        // Apply random classes using configuration
        const speedConfig = [
            { threshold: 0.02, class: 'speed-ultra' },
            { threshold: 0.07, class: 'speed-crawl' },
            { threshold: 0.17, class: 'speed-fast' },
            { threshold: 0.42, class: 'speed-slow' }
        ];
        
        const fadeConfig = [
            { threshold: 0.2, class: 'fade-dark' },
            { threshold: 0.4, class: 'fade-light' },
            { threshold: 0.6, class: 'pulse-dark' },
            { threshold: 0.8, class: 'pulse-light' },
            { threshold: 1.0, class: 'fade-bold' }
        ];
        
        const sizeConfig = [
            { threshold: 0.3, class: 'size-large' },
            { threshold: 0.6, class: 'size-small' },
            { threshold: 1.0, class: 'size-medium' }
        ];
        
        // Apply random classes
        applyRandomClass(firefly, speedConfig, Math.random());
        applyRandomClass(firefly, fadeConfig, Math.random());
        applyRandomClass(firefly, sizeConfig, Math.random());
        
        return firefly;
    }
    
    // Helper function to apply random classes
    function applyRandomClass(element, config, random) {
        for (const item of config) {
            if (random < item.threshold) {
                element.classList.add(item.class);
                break;
            }
        }
    }

    // Generate multiple fireflies for background animation
    function initializeFireflies() {
        if (!fireflyContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const firefly = createFirefly();
            fireflyContainer.appendChild(firefly);
        }
    }

    // Handle instant scrolling to sections
    function handleInstantScroll(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'auto'
            });
        }
    }

    // Attach scroll listeners
    function attachScrollListeners() {
        navbarLinks.forEach(link => {
            link.addEventListener('click', handleInstantScroll);
        });
    }

    // Set up intersection observer for scroll animations
    function createIntersectionObserver() {
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.id === 'skills' && !entry.target.dataset.animated) {
                        animateProgressBars();
                        entry.target.dataset.animated = 'true';
                    }
                }
            });
        }, { threshold: 0.1 });
    }

    // Observe sections for visibility
    function observeSections() {
        if ('IntersectionObserver' in window) {
            const observer = createIntersectionObserver();
            sections.forEach(section => {
                observer.observe(section);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            sections.forEach(section => {
                section.classList.add('visible');
            });
            animateProgressBars();
        }
    }

    // Animate skill progress bars when in view
    function animateProgressBars() {
        progressFills.forEach(fill => {
            const progress = fill.getAttribute('data-progress') || '0';
            fill.style.width = `${progress}%`;
        });
    }





    // Manage CV download functionality
    function handleCvDownload() {
        if (!downloadButton || !cvDownloadLink) return;
        
        downloadButton.addEventListener('click', function(event) {
            event.preventDefault();
            cvDownloadLink.hidden = false;
            cvDownloadLink.click();
            cvDownloadLink.hidden = true;
        });
    }

    // Add hover animations to social media icons
    function addSocialIconHoverEffects() {
        allSocialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.1)';
            });
            icon.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1)';
            });
        });
    }

    // Initialize progress bars
    function initializeProgressBars() {
        progressFills.forEach(fill => {
            fill.style.width = '0%';
            const progress = fill.getAttribute('data-progress') || '0';
            fill.setAttribute('aria-valuenow', progress);
        });
    }

    // Handle reduced motion preference
    function handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            sections.forEach(section => {
                section.classList.add('visible');
            });
            animateProgressBars();
        }
    }

    // Add touch support for mobile
    function addTouchSupport() {
        allCards.forEach(card => {
            card.addEventListener('touchstart', () => {
                // Touch events handled by CSS
            });
        });
    }



    // Initialize all functionality
    function initialize() {
        try {
            initializeFireflies();
            attachScrollListeners();
            observeSections();

            handleCvDownload();
            addSocialIconHoverEffects();
            initializeProgressBars();
            handleReducedMotion();
            addTouchSupport();
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    // Start the application
    initialize();
});
